from fastapi import FastAPI
from services import obtener_datos_diccionario, DefinicionLimpia

app = FastAPI(
    title="MIRACLE - Microservicio Adaptativo",
    description="Servicio de procesamiento lingüístico y consulta de fuentes web",
    version="1.0.0"
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "python-microservice"}

# Endpoint que consume la fuente web
@app.get("/api/vocabulario/{palabra}", response_model=DefinicionLimpia)
async def consultar_palabra(palabra: str):
    return await obtener_datos_diccionario(palabra)