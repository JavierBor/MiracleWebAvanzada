from main import health_check


def test_health_check():
    respuesta = health_check()
    assert respuesta == {"status": "ok", "service": "python-microservice"}
