from fastapi import FastAPI, Path, HTTPException
from services import DefinicionLimpia, obtener_datos_diccionario

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
        200: {
            "description": "Datos recuperados y procesados exitosamente."},
        422: {
            "description": "Validación fallida: La palabra contiene números o caracteres no permitidos."},
        404: {
            "description": "La palabra no existe en las fuentes externas."},
        502: {
            "description": "Error o caída en Datamuse/MyMemory."},
        504: {
            "description": "Tiempo de espera agotado al consultar la fuente web."}})
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
        # Llamada a la lógica central de extracción
        resultado = await obtener_datos_diccionario(palabra)

        # Validación extra: si por alguna razón no hay resultado
        if not resultado:
            raise HTTPException(status_code=404, detail=f"No se encontraron definiciones para '{palabra}'")

        return resultado

    except HTTPException:
        # Si el error ya es un HTTP (ej. 404, 502, 504), lo dejamos pasar tal cual
        raise
    except Exception as e:
        # Manejo de errores general para evitar que el servicio colapse
        raise HTTPException(status_code=500, detail=f"Error interno procesando la palabra: {str(e)}")
