import httpx
from typing import List, Optional
from pydantic import BaseModel
from fastapi import HTTPException
from deep_translator import MyMemoryTranslator

# Esquema de datos para NestJS
class DefinicionLimpia(BaseModel):
    palabra: str
    fonetica: Optional[str] = None
    audio_url: Optional[str] = None
    categoria_gramatical: str
    definicion: str                      # Definición traducida al español
    definicion_en: Optional[str] = None        # Definición original en inglés
    ejemplo: Optional[str] = None
    sinonimos: List[str] = []

DATAMUSE_URL = "https://api.datamuse.com/words"

HEADERS = {
    "User-Agent": "MiracleApp/1.0 (Educational Project PUCV)",
    "Accept": "application/json"
}

# Mapeo de categorías gramaticales a español
MAPA_CATEGORIAS = {
    "n": "sustantivo",
    "v": "verbo",
    "adj": "adjetivo",
    "adv": "adverbio",
    "u": "interjección"
}

async def obtener_datos_diccionario(palabra: str) -> DefinicionLimpia:
    palabra_limpia = palabra.strip().lower()
    
    params = {
        "sp": palabra_limpia,
        "md": "dpr",
        "max": "1"
    }
    
    # 1. Consulta asíncrona a Datamuse API
    async with httpx.AsyncClient(timeout=8.0, headers=HEADERS) as client:
        try:
            response = await client.get(DATAMUSE_URL, params=params)
        except httpx.ReadTimeout:
            raise HTTPException(
                status_code=504,
                detail="La fuente externa Datamuse tardó demasiado en responder"
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=503,
                detail=f"Error al conectar con la API externa: {type(exc).__name__}"
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
        
        # 2. Extracción y separación de categoría y definición
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

        # 3. Traducción al español con MyMemory
        try:
            definicion_espanol = MyMemoryTranslator(source='en-US', target='es-ES').translate(definicion_original)
        except Exception:
            definicion_espanol = definicion_original

        # 4. Extracción de fonética
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
