from datetime import datetime, timezone

from sqlmodel import Field, Relationship, SQLModel

class Videos(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titulo: str
    source: str
    thumbnail: str
    categoria: str
    canal: str = "Canal KR"
    vistas: int = 0
    descripcion: str = ""
    es_publico: bool = True
    comentarios: list["Comments"] = Relationship(back_populates="video")

class VideosCreate(SQLModel):
    titulo: str
    source: str
    thumbnail: str
    categoria: str
    canal: str = "Canal KR"
    vistas: int = 0
    descripcion: str = ""
    es_publico: bool = True

class Comments(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    autor: str
    texto: str
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    video_id: int = Field(foreign_key="videos.id")
    video: Videos | None = Relationship(back_populates="comentarios")

class CommentsCreate(SQLModel):
    autor: str = Field(min_length=1, max_length=40)
    texto: str = Field(min_length=1, max_length=500)
