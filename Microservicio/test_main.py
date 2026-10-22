import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from main import app
from services import DefinicionLimpia

# Instanciamos el cliente de pruebas de FastAPI
client = TestClient(app)


# --- 1. PRUEBA DE SALUD ---
def test_health_check():
    """Prueba el endpoint de salud del sistema."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "python-microservice"}


# --- 2. PRUEBAS DE VOCABULARIO Y DICCIONARIO ---
@patch("main.obtener_datos_diccionario", new_callable=AsyncMock)
def test_consultar_palabra_valida(mock_obtener):
    """
    Prueba de endpoint y procesamiento:
    Verifica que una palabra válida devuelve un 200 y cumple con el contrato.
    """
    mock_obtener.return_value = DefinicionLimpia(
        palabra="student",
        fonetica="pron:stoo.dənt",
        audio_url=None,
        categoria_gramatical="sustantivo",
        definicion="Estudiante o alumno.",
        definicion_en="A person who is studying at a school or college.",
        ejemplo=None,
        sinonimos=[]
    )
    response = client.get("/api/vocabulario/student")
    assert response.status_code == 200
    data = response.json()

    # Validamos que el contrato de salida contenga los campos requeridos
    assert data["palabra"] == "student"
    assert "definicion" in data
    assert "categoria_gramatical" in data
    assert "fonetica" in data


def test_consultar_palabra_invalida():
    """
    Prueba con datos inválidos y validación:
    Verifica que enviar números o símbolos arroje un error 422 (Unprocessable Entity).
    """
    response = client.get("/api/vocabulario/student123")
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data  # FastAPI devuelve el detalle del error de validación


@patch("main.obtener_datos_diccionario", new_callable=AsyncMock)
def test_consultar_palabra_no_encontrada(mock_obtener):
    """
    Prueba de errores:
    Verifica que buscar una palabra que no existe en el diccionario devuelva 404.
    """
    mock_obtener.return_value = None
    response = client.get("/api/vocabulario/zxqwy")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data


# --- 3. PRUEBAS DEL MOTOR DE BÚSQUEDA DEL FORO (PUNTO 6) ---
def test_buscar_foro_exito():
    """Verifica que la búsqueda ordene por similitud de coseno usando TF-IDF."""
    payload = {
        "query": "examen ingles",
        "documents": [
            {"id": 1, "content": "Tengo una duda sobre la fecha del examen final de ingles"},
            {"id": 2, "content": "El entregable del proyecto final de arquitectura web"},
            {"id": 3, "content": "Repaso de vocabulario en ingles para la prueba"}
        ]
    }
    response = client.post("/api/foro/buscar", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "examen ingles"
    assert "processing_time_ms" in data
    assert len(data["results"]) > 0
    # El documento con ID 1 coincide mejor y lidera el ranking
    assert data["results"][0]["id"] == 1
    assert data["results"][0]["score"] > 0


def test_buscar_foro_corpus_vacio():
    """Verifica respuesta adecuada cuando el foro no contiene documentos."""
    payload = {
        "query": "examen",
        "documents": []
    }
    response = client.post("/api/foro/buscar", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["results"] == []
    assert data["processing_time_ms"] == 0.0


def test_buscar_foro_stopwords():
    """Verifica que consultas compuestas solo por stopwords no generen excepciones."""
    payload = {
        "query": "the an and",
        "documents": [
            {"id": 1, "content": "This is a simple post"}
        ]
    }
    response = client.post("/api/foro/buscar", json=payload)
    assert response.status_code == 200
    assert response.json()["results"] == []


# --- 4. PRUEBAS DE EVALUACIÓN CUANTITATIVA (PUNTO 7) ---
def test_evaluar_foro_exito():
    """Verifica el cálculo de métricas Precision@3, latencia y registros válidos."""
    sample_docs = [
        {"id": 1, "content": "Tengo una duda sobre la fecha del examen final"},
        {"id": 2, "content": "El examen de ingles se realizara la proxima semana"},
        {"id": 3, "content": "Entregable del proyecto final de arquitectura web"},
        {"id": 4, "content": "Lista de palabras sobre vocabulario ingles"},
        {"id": 5, "content": "Ejercicio de pronunciacion y vocabulario ingles"}
    ]
    response = client.post("/api/foro/evaluar", json=sample_docs)
    assert response.status_code == 200
    data = response.json()
    assert data["metric"] == "Precision@3"
    assert "average_precision" in data
    assert "average_latency_ms" in data
    assert "valid_records_percentage" in data
    assert data["total_test_cases"] == 3


def test_evaluar_foro_sin_documentos():
    """Verifica que la evaluación con lista vacía retorne métricas en cero sin colapsar."""
    response = client.post("/api/foro/evaluar", json=[])
    assert response.status_code == 200
    data = response.json()
    assert data["average_precision"] == 0.0
    assert data["average_latency_ms"] == 0.0
    