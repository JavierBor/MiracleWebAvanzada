from fastapi import FastAPI, Path, HTTPException
from services import DefinicionLimpia, obtener_datos_diccionario

from models import SearchRequest, SearchResponse, SearchResult
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import time

app = FastAPI(
    title="MIRACLE - Microservicio Adaptativo",
    description=(
        "Servicio de procesamiento lingüístico "
        "y consulta de fuentes web para adaptar "
        "el nivel de dificultad del estudiante."
    ),
    version="1.0.0",
)


@app.get("/health", summary="Revisión de salud del microservicio")
def health_check():
    return {"status": "ok", "service": "python-microservice"}


# Endpoint que consume la fuente web
@app.get(
    "/api/vocabulario/{palabra}",
    response_model=DefinicionLimpia,
    summary="Extrae y fusiona datos de vocabulario",
    description=(
        "Consulta Datamuse y MyMemory para extraer fonética, audios y "
        "definiciones de una palabra, fusionándolas en un contrato estandarizado."
    ),
    responses={
        200: {"description": "Datos recuperados y procesados exitosamente."},
        422: {"description": "Validación fallida: La palabra contiene números o caracteres no permitidos."},
        404: {"description": "La palabra no existe en las fuentes externas."},
        502: {"description": "Error o caída en Datamuse/MyMemory."},
        504: {"description": "Tiempo de espera agotado al consultar la fuente web."}
    }
)
async def consultar_palabra(
    palabra: str = Path(
        ...,
        title="Palabra a buscar",
        min_length=2,
        max_length=30,
        pattern="^[a-zA-Z]+$",  # Solo letras, sin números ni símbolos
        description="La palabra debe contener únicamente letras del alfabeto inglés."
    )
):
    try:
        resultado = await obtener_datos_diccionario(palabra)

        if not resultado:
            raise HTTPException(status_code=404, detail=f"No se encontraron definiciones para '{palabra}'")

        return resultado

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno procesando la palabra: {str(e)}")


# --- NUEVO ENDPOINT: MOTOR DE BÚSQUEDA DEL FORO ---
@app.post(
    "/api/foro/buscar", 
    response_model=SearchResponse,
    summary="Motor de búsqueda inteligente para el foro",
    description="Recibe una consulta y un corpus de publicaciones, y devuelve un ranking de relevancia usando algoritmos de Recuperación de Información (TF-IDF)."
)
def search_forum(request: SearchRequest):
    start_time = time.time()
    
    # 1. Extraer el corpus (solo el texto de las publicaciones)
    corpus = [doc.content for doc in request.documents]
    
    # Si el foro está vacío, retornamos vacío
    if not corpus:
        return SearchResponse(query=request.query, processing_time_ms=0, results=[])

    # 2. Tokenización, Normalización y creación del Índice TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english') 
    
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vec = vectorizer.transform([request.query])
    except ValueError:
        # Falla si todas las palabras de la query son stopwords
        return SearchResponse(query=request.query, processing_time_ms=0, results=[])

    # 3. Criterio de Ranking: Similitud del Coseno
    cosine_similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()

    # 4. Recuperación de Resultados Relevantes
    results = []
    for idx, score in enumerate(cosine_similarities):
        if score > 0.0:  
            results.append(SearchResult(
                id=request.documents[idx].id,
                score=round(float(score), 4)
            ))

    # 5. Ordenar de mayor a menor relevancia
    results.sort(key=lambda x: x.score, reverse=True)

    processing_time = (time.time() - start_time) * 1000

    # 6. Retornar los metadatos exigidos por la rúbrica
    return SearchResponse(
        query=request.query,
        processing_time_ms=round(processing_time, 2),
        results=results
    )