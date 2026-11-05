from fastapi import APIRouter, HTTPException, status
from sqlmodel import func, select

from db import SessionDep
from models import Comments, CommentsCreate, Videos, VideosCreate

router = APIRouter(prefix="/videos")

def buscar_video(session, video_id: int) -> Videos:
    video_db = session.get(Videos, video_id)
    if not video_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="El video no existe"
        )
    return video_db

@router.get("/")
def get_videos(
    session: SessionDep, categoria: str | None = None, aleatorio: bool = False
):
    consulta = select(Videos).where(Videos.es_publico == True)
    if categoria:
        consulta = consulta.where(Videos.categoria == categoria)
    if aleatorio:
        consulta = consulta.order_by(func.random())
    return session.exec(consulta).all()

@router.get("/categorias")
def get_categorias(session: SessionDep):
    return session.exec(select(Videos.categoria).distinct()).all()

@router.get("/{video_id}")
def get_video_by_id(video_id: int, session: SessionDep):
    return buscar_video(session, video_id)

@router.get("/{video_id}/recomendados")
def get_recomendados(video_id: int, session: SessionDep):
    video_db = buscar_video(session, video_id)
    consulta = (
        select(Videos)
        .where(Videos.categoria == video_db.categoria)
        .where(Videos.id != video_id)
        .where(Videos.es_publico == True)
        .order_by(func.random())
        .limit(10)
    )
    return session.exec(consulta).all()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_video(video_data: VideosCreate, session: SessionDep):
    video = Videos.model_validate(video_data.model_dump())
    session.add(video)
    session.commit()
    session.refresh(video)
    return video

@router.get("/{video_id}/comentarios")
def get_comentarios(video_id: int, session: SessionDep):
    buscar_video(session, video_id)
    consulta = (
        select(Comments)
        .where(Comments.video_id == video_id)
        .order_by(Comments.fecha.desc())
    )
    return session.exec(consulta).all()

@router.post("/{video_id}/comentarios", status_code=status.HTTP_201_CREATED)
def create_comentario(video_id: int, data: CommentsCreate, session: SessionDep):
    buscar_video(session, video_id)
    comentario = Comments(autor=data.autor, texto=data.texto, video_id=video_id)
    session.add(comentario)
    session.commit()
    session.refresh(comentario)
    return comentario
