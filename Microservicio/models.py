from pydantic import BaseModel, Field
from typing import List, Union, Optional, Literal


class ForumDocument(BaseModel):
    id: Union[int, str]
    content: Optional[str] = ""


class SearchRequest(BaseModel):
    query: str
    documents: List[ForumDocument]


class SearchResult(BaseModel):
    id: Union[int, str]
    score: float


class SearchResponse(BaseModel):
    query: str
    processing_time_ms: float
    results: List[SearchResult]


# --- MODELOS DEL MOTOR ADAPTATIVO (DDA) ---

NivelDificultad = Literal["Normal", "Difícil", "Experto"]


class AdaptiveRequest(BaseModel):
    racha_actual: int = Field(default=0, ge=0, description="Aciertos consecutivos actuales")
    ultimo_resultado: Optional[bool] = Field(
        default=None,
        description="True si acertó la ronda previa, False si falló, None al iniciar"
    )
    verbos_usados: List[str] = Field(
        default_factory=list,
        description="Lista de verbos base ya jugados en la sesión"
    )
    modo_manual: bool = Field(
        default=False,
        description="Si es True, usa dificultad_fija seleccionada por el estudiante"
    )
    dificultad_fija: Optional[NivelDificultad] = Field(
        default=None,
        description="Nivel elegido manualmente cuando modo_manual=True"
    )


class AdaptiveResponse(BaseModel):
    verbo_base: str
    formas_pasado: List[str]
    nivel_activo: NivelDificultad
    es_adaptativo: bool
    explicacion_adaptacion: str
    pista_espanol: Optional[str] = None
    fonetica: Optional[str] = None
    fuente: str = "Motor DDA Miracle + Datamuse API"
