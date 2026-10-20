from fastapi.testclient import TestClient
from main import app

# Instanciamos el cliente de pruebas de FastAPI
client = TestClient(app)


def test_health_check():
    """Prueba el endpoint de salud del sistema."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "python-microservice"}


def test_consultar_palabra_valida():
    """
    Prueba de endpoint y procesamiento:
    Verifica que una palabra válida devuelve un 200 y cumple con el contrato.
    """
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


def test_consultar_palabra_no_encontrada():
    """
    Prueba de errores:
    Verifica que buscar una palabra que no existe en el diccionario devuelva 404.
    """
    response = client.get("/api/vocabulario/zxqwy")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "no fue encontrada" in data["detail"]
