import time
from fastapi import FastAPI, Path, HTTPException, Request
from services import (
    DefinicionLimpia,
    obtener_datos_diccionario,
    search_forum_posts,
    evaluate_search_engine
)
from models import SearchRequest, SearchResponse, ForumDocument

app = FastAPI(
    title="MIRACLE - Microservicio Adaptativo",
    description=(
        "Servicio de procesamiento lingüístico "
        "y consulta de fuentes web para adaptar "
        "el nivel de dificultad del estudiante."
    ),
    version="1.0.0",
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000  # En milisegundos
    response.headers["X-Response-Time"] = f"{process_time:.2f}ms"
    print(f"[LATENCIA] {request.method} {request.url.path} - {process_time:.2f}ms")
    return response


@app.get("/health", summary="Revisión de salud del microservicio")
def health_check():
    return {"status": "ok", "service": "python-microservice"}


# --- VOCABULARIO Y DICCIONARIO EXTERNO (PUNTOS 2, 3 Y 4) ---
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
        pattern="^[a-zA-Z]+$",
        description="La palabra debe contener únicamente letras del alfabeto inglés."
    )
):
    try:
        resultado = await obtener_datos_diccionario(palabra)

        if not resultado:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontraron definiciones para '{palabra}'"
            )

        return resultado

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno procesando la palabra: {str(e)}"
        )


# --- PUNTO 6: MOTOR DE BÚSQUEDA DEL FORO ---
@app.post(
    "/api/foro/buscar",
    response_model=SearchResponse,
    summary="Motor de búsqueda inteligente para el foro",
    description=(
        "Recibe una consulta y un corpus de publicaciones, "
        "y devuelve un ranking de relevancia usando algoritmos "
        "de Recuperación de Información (TF-IDF)."
    )
)
def search_forum(request: SearchRequest):
    return search_forum_posts(request.query, request.documents)


# --- PUNTO 7: EVALUACIÓN CUANTITATIVA DE LA BÚSQUEDA ---
@app.post(
    "/api/foro/evaluar",
    summary="Evaluación cuantitativa del motor de búsqueda",
    description=(
        "Ejecuta casos de prueba sobre el corpus recibido para calcular "
        "la métrica Precision@3, latencia en ms y % de registros válidos."
    )
)
def evaluate_forum_search(documents: list[ForumDocument]):
    test_cases = [
        {"query": "duda examen", "expected_ids": [1, 2]},
        {"query": "proyecto final", "expected_ids": [3]},
        {"query": "vocabulario ingles", "expected_ids": [4, 5]}
    ]
    return evaluate_search_engine(documents, test_cases, k=3)