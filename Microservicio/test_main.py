from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from main import app, INTERNAL_API_KEY
from services import DefinicionLimpia


# Instanciamos el cliente de pruebas de FastAPI
client = TestClient(app)
INTERNAL_HEADERS = {"X-Internal-Api-Key": INTERNAL_API_KEY}


# --- 1. PRUEBA DE SALUD ---
def test_health_check():
    """Prueba el endpoint de salud del sistema (público para Docker/Render)."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "python-microservice"}
    assert "X-Request-Id" in response.headers


# --- 1.5. PRUEBAS DE SEGURIDAD INTERNA (X-Internal-Api-Key) ---
def test_rechaza_peticion_sin_api_key():
    """Verifica que los endpoints internos rechacen peticiones sin X-Internal-Api-Key."""
    response = client.get("/api/vocabulario/student")
    assert response.status_code == 403
    assert "X-Internal-Api-Key" in response.json()["detail"]


def test_rechaza_peticion_con_api_key_invalida():
    """Verifica que los endpoints internos rechacen una clave interna incorrecta."""
    response = client.post(
        "/api/adaptativo/siguiente-verbo",
        json={"racha_actual": 0},
        headers={"X-Internal-Api-Key": "clave_incorrecta"},
    )
    assert response.status_code == 403


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
    response = client.get("/api/vocabulario/student", headers=INTERNAL_HEADERS)
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
    response = client.get("/api/vocabulario/student123", headers=INTERNAL_HEADERS)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@patch("main.obtener_datos_diccionario", new_callable=AsyncMock)
def test_consultar_palabra_no_encontrada(mock_obtener):
    """
    Prueba de errores:
    Verifica que buscar una palabra que no existe en el diccionario devuelva 404.
    """
    mock_obtener.return_value = None
    response = client.get("/api/vocabulario/zxqwy", headers=INTERNAL_HEADERS)
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
    response = client.post("/api/foro/buscar", json=payload, headers=INTERNAL_HEADERS)
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
    response = client.post("/api/foro/buscar", json=payload, headers=INTERNAL_HEADERS)
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
    response = client.post("/api/foro/buscar", json=payload, headers=INTERNAL_HEADERS)
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
    response = client.post("/api/foro/evaluar", json=sample_docs, headers=INTERNAL_HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["metric"] == "Precision@3"
    assert "average_precision" in data
    assert "average_latency_ms" in data
    assert "valid_records_percentage" in data
    assert data["total_test_cases"] == 3


def test_evaluar_foro_sin_documentos():
    """Verifica que la evaluación con lista vacía retorne métricas en cero sin colapsar."""
    response = client.post("/api/foro/evaluar", json=[], headers=INTERNAL_HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["average_precision"] == 0.0
    assert data["average_latency_ms"] == 0.0


# --- 5. PRUEBAS DEL MOTOR ADAPTATIVO (DDA) ---
@patch("services.obtener_datos_diccionario", new_callable=AsyncMock)
def test_adaptativo_nivel_normal_inicial(mock_diccionario):
    """Racha 0 debe asignar nivel Normal con verbos regulares."""
    mock_diccionario.return_value = DefinicionLimpia(
        palabra="play",
        fonetica="pleɪ",
        audio_url=None,
        categoria_gramatical="verbo",
        definicion="Jugar.",
    )
    response = client.post(
        "/api/adaptativo/siguiente-verbo",
        json={"racha_actual": 0, "verbos_usados": []},
        headers=INTERNAL_HEADERS,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nivel_activo"] == "Normal"
    assert data["es_adaptativo"] is True
    assert "explicacion_adaptacion" in data


@patch("services.obtener_datos_diccionario", new_callable=AsyncMock)
def test_adaptativo_sube_a_dificil_y_experto(mock_diccionario):
    """Racha 5 sube a Difícil y racha 10 sube a Experto."""
    mock_diccionario.return_value = DefinicionLimpia(
        palabra="go",
        fonetica="ɡoʊ",
        audio_url=None,
        categoria_gramatical="verbo",
        definicion="Ir.",
    )
    res_dificil = client.post(
        "/api/adaptativo/siguiente-verbo",
        json={"racha_actual": 5},
        headers=INTERNAL_HEADERS,
    )
    assert res_dificil.status_code == 200
    assert res_dificil.json()["nivel_activo"] == "Difícil"

    res_experto = client.post(
        "/api/adaptativo/siguiente-verbo",
        json={"racha_actual": 10},
        headers=INTERNAL_HEADERS,
    )
    assert res_experto.status_code == 200
    assert res_experto.json()["nivel_activo"] == "Experto"


@patch("services.obtener_datos_diccionario", new_callable=AsyncMock)
def test_adaptativo_reinicia_tras_error(mock_diccionario):
    """Si ultimo_resultado es False, debe bajar a Normal aunque trajera racha alta."""
    mock_diccionario.return_value = DefinicionLimpia(
        palabra="work",
        fonetica="wɜːrk",
        audio_url=None,
        categoria_gramatical="verbo",
        definicion="Trabajar.",
    )
    response = client.post(
        "/api/adaptativo/siguiente-verbo",
        json={"racha_actual": 8, "ultimo_resultado": False},
        headers=INTERNAL_HEADERS,
    )
    assert response.status_code == 200
    assert response.json()["nivel_activo"] == "Normal"


@patch("services.obtener_datos_diccionario", new_callable=AsyncMock)
def test_adaptativo_control_manual_usuario(mock_diccionario):
    """Si modo_manual=True, respeta dificultad_fija ignorando racha 0."""
    mock_diccionario.return_value = DefinicionLimpia(
        palabra="teach",
        fonetica="tiːtʃ",
        audio_url=None,
        categoria_gramatical="verbo",
        definicion="Enseñar.",
    )
    response = client.post(
        "/api/adaptativo/siguiente-verbo",
        json={"racha_actual": 0, "modo_manual": True, "dificultad_fija": "Experto"},
        headers=INTERNAL_HEADERS,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nivel_activo"] == "Experto"
    assert data["es_adaptativo"] is False