
from pydantic import BaseModel
from typing import List, Union, Optional


class ForumDocument(BaseModel):
    id: Union[int, str]
    content: Optional[str] = ""  # Acepta textos vacíos o nulos para evitar el error 422


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
