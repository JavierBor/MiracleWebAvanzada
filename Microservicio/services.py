import asyncio
from typing import List, Optional

import httpx
from fastapi import HTTPException
from pydantic import BaseModel


class DefinicionLimpia(BaseModel):
    palabra: str
    fonetica: Optional[str] = None
    audio_url: Optional[str] = None
    categoria_gramatical: str
    definicion: str
    ejemplo: Optional[str] = None
    sinonimos: List[str] = []


API_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"

CUSTOM_HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
}


async def obtener_datos_diccionario(palabra: str) -> DefinicionLimpia:
    palabra_limpia = palabra.strip().lower()

    timeout = httpx.Timeout(
        connect=10.0,
        read=30.0,
        write=10.0,
        pool=10.0,
    )

    async with httpx.AsyncClient(
        timeout=timeout,
        follow_redirects=True,
        headers=CUSTOM_HEADERS,
    ) as client:

        response = None

        for intento in range(3):
            try:
                response = await client.get(
                    f"{API_BASE_URL}{palabra_limpia}"
                )

                # Si la respuesta NO es error de servidor,
                # dejamos de reintentar.
                if response.status_code < 500:
                    break

                # Error 5xx: reintento limitado
                if intento < 2:
                    await asyncio.sleep(2 ** intento)

            except httpx.ReadTimeout:
                if intento == 2:
                    raise HTTPException(
                        status_code=504,
                        detail=(
                            "La fuente externa tardó demasiado "
                            "en responder"
                        ),
                    )

                await asyncio.sleep(2 ** intento)

            except httpx.ConnectTimeout:
                if intento == 2:
                    raise HTTPException(
                        status_code=504,
                        detail=(
                            "No fue posible establecer conexión "
                            "con la fuente externa a tiempo"
                        ),
                    )

                await asyncio.sleep(2 ** intento)

            except httpx.RequestError as exc:
                if intento == 2:
                    raise HTTPException(
                        status_code=503,
                        detail=(
                            "No fue posible conectar con la "
                            "fuente externa: "
                            f"{type(exc).__name__}"
                        ),
                    )

                await asyncio.sleep(2 ** intento)

        if response is None:
            raise HTTPException(
                status_code=503,
                detail=(
                    "No fue posible obtener respuesta de "
                    "la fuente externa"
                ),
            )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"La palabra '{palabra_limpia}' "
                    "no fue encontrada"
                ),
            )

        if response.status_code >= 500:
            raise HTTPException(
                status_code=503,
                detail=(
                    "La fuente externa no está disponible "
                    "temporalmente "
                    f"(HTTP {response.status_code})"
                ),
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=(
                    "Respuesta inesperada de la fuente externa "
                    f"(HTTP {response.status_code})"
                ),
            )

        try:
            data = response.json()
        except ValueError:
            raise HTTPException(
                status_code=502,
                detail=(
                    "La fuente externa devolvió una respuesta "
                    "JSON inválida"
                ),
            )

        if not data:
            raise HTTPException(
                status_code=502,
                detail=(
                    "La fuente externa devolvió una "
                    "respuesta vacía"
                ),
            )

        item = data[0]

        audio = None
        fonetica = item.get("phonetic")

        for phon in item.get("phonetics", []):
            if not fonetica and phon.get("text"):
                fonetica = phon.get("text")

            if not audio and phon.get("audio"):
                audio = phon.get("audio")

        meanings = item.get("meanings", [])
        primer_meaning = meanings[0] if meanings else {}

        definitions = primer_meaning.get("definitions", [])
        primera_def = definitions[0] if definitions else {}

        return DefinicionLimpia(
            palabra=item.get("word", palabra_limpia),
            fonetica=fonetica,
            audio_url=audio,
            categoria_gramatical=primer_meaning.get(
                "partOfSpeech",
                "general",
            ),
            definicion=primera_def.get(
                "definition",
                "Sin definición disponible",
            ),
            ejemplo=primera_def.get("example"),
            sinonimos=primera_def.get("synonyms", []),
        )
