
import httpx
import asyncio
import time
from typing import List, Optional
from pydantic import BaseModel
from fastapi import HTTPException
from deep_translator import MyMemoryTranslator
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from models import ForumDocument, SearchResult, SearchResponse


# --- 1. DICCIONARIO Y TRADUCCIÓN ---


class DefinicionLimpia(BaseModel):
    palabra: str
    fonetica: Optional[str] = None
    audio_url: Optional[str] = None
    categoria_gramatical: str
    definicion: str
    definicion_en: Optional[str] = None
    ejemplo: Optional[str] = None
    sinonimos: List[str] = []


DATAMUSE_URL = "https://api.datamuse.com/words"

HEADERS = {
    "User-Agent": "MiracleApp/1.0 (Educational Project PUCV)",
    "Accept": "application/json"
}

MAPA_CATEGORIAS = {
    "n": "sustantivo",
    "v": "verbo",
    "adj": "adjetivo",
    "adv": "adverbio",
    "u": "interjección"
}


def traducir_texto(texto: str) -> str:
    try:
        return MyMemoryTranslator(source="en-US", target="es-ES").translate(texto)
    except Exception:
        return texto


async def obtener_datos_diccionario(palabra: str) -> DefinicionLimpia:
    palabra_limpia = palabra.strip().lower()

    params = {
        "sp": palabra_limpia,
        "md": "dpr",
        "max": "1"
    }

    async with httpx.AsyncClient(timeout=3.5, headers=HEADERS) as client:
        try:
            response = await client.get(DATAMUSE_URL, params=params)
        except httpx.ReadTimeout:
            raise HTTPException(
                status_code=504,
                detail="La fuente Datamuse tardó demasiado en responder"
            )
        except httpx.RequestError as exc:
            msg = f"Error al conectar con la API externa: {type(exc).__name__}"
            raise HTTPException(
                status_code=503,
                detail=msg
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"Error devuelto por la fuente externa (HTTP {response.status_code})"
            )

        data = response.json()
        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"La palabra '{palabra_limpia}' no fue encontrada en la fuente externa"
            )

        item = data[0]
        defs = item.get("defs", [])

        categoria = "general"
        definicion_original = "No definition available"

        if defs:
            primera_def = defs[0]
            if "\t" in primera_def:
                cat_abrev, desc = primera_def.split("\t", 1)
                categoria = MAPA_CATEGORIAS.get(cat_abrev, cat_abrev)
                definicion_original = desc
            else:
                definicion_original = primera_def

        definicion_espanol = await asyncio.to_thread(traducir_texto, definicion_original)

        fonetica = None
        for tag in item.get("tags", []):
            if tag.startswith("pron:"):
                fonetica = tag.replace("pron:", "")
                break

        return DefinicionLimpia(
            palabra=item.get("word", palabra_limpia),
            fonetica=fonetica,
            audio_url=None,
            categoria_gramatical=categoria,
            definicion=definicion_espanol,
            definicion_en=definicion_original,
            ejemplo=None,
            sinonimos=[]
        )


# --- 2. BÚSQUEDA Y EVALUACIÓN DEL FORO (PUNTOS 6 Y 7) ---


def search_forum_posts(query: str, documents: list[ForumDocument]) -> SearchResponse:
    start_time = time.time()

    if not documents or not query.strip():
        return SearchResponse(query=query, processing_time_ms=0.0, results=[])

    contents = [doc.content or "" for doc in documents]

    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(contents)
        query_vec = vectorizer.transform([query])
        cosine_sim = cosine_similarity(query_vec, tfidf_matrix).flatten()
    except ValueError:
        return SearchResponse(query=query, processing_time_ms=0.0, results=[])

    results = []
    for idx, score in enumerate(cosine_sim):
        if score > 0.0:
            results.append(SearchResult(id=documents[idx].id, score=round(float(score), 4)))

    results.sort(key=lambda x: x.score, reverse=True)

    elapsed_time = (time.time() - start_time) * 1000
    return SearchResponse(
        query=query,
        processing_time_ms=round(elapsed_time, 2),
        results=results
    )


def evaluate_search_engine(documents: list[ForumDocument], test_cases: list[dict], k: int = 3) -> dict:
    total_precision = 0.0
    total_time = 0.0
    successful_queries = 0

    for test in test_cases:
        query = test["query"]
        expected_ids = set(test["expected_ids"])

        response = search_forum_posts(query, documents)
        retrieved_ids = [r.id for r in response.results[:k]]

        if retrieved_ids:
            relevant_retrieved = len(set(retrieved_ids).intersection(expected_ids))
            precision_at_k = relevant_retrieved / min(k, len(retrieved_ids))
        else:
            precision_at_k = 0.0

        total_precision += precision_at_k
        total_time += response.processing_time_ms
        if len(response.results) > 0 or len(expected_ids) == 0:
            successful_queries += 1

    num_tests = len(test_cases)
    return {
        "metric": f"Precision@{k}",
        "average_precision": round(total_precision / num_tests, 4) if num_tests > 0 else 0.0,
        "average_latency_ms": round(total_time / num_tests, 2) if num_tests > 0 else 0.0,
        "valid_records_percentage": round((successful_queries / num_tests) * 100, 2) if num_tests > 0 else 0.0,
        "total_test_cases": num_tests
    }
