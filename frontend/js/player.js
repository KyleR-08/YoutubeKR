const idVideo = new URLSearchParams(location.search).get("id");

const reproductor = document.querySelector("#video-principal");
const tituloVideo = document.querySelector("#titulo-video");
const canalVideo = document.querySelector("#canal-video");
const descripcionVideo = document.querySelector("#descripcion-video");
const listaRecomendados = document.querySelector("#lista-recomendados");
const listaComentarios = document.querySelector("#lista-comentarios");
const tituloComentarios = document.querySelector("#titulo-comentarios");
const formulario = document.querySelector("#form-comentario");
const inputAutor = document.querySelector("#autor");
const inputTexto = document.querySelector("#texto");

let totalComentarios = 0;

function mostrarVideo(video) {
  document.title = video.titulo;
  reproductor.src = video.source;
  reproductor.poster = video.thumbnail;
  tituloVideo.textContent = video.titulo;
  canalVideo.textContent = video.canal;
  descripcionVideo.textContent = `${formatearVistas(video.vistas)} · ${video.descripcion}`;
}

function crearItemLista(video, posicion) {
  const item = document.createElement("article");
  item.className = "item-lista";
  item.style.animationDelay = `${posicion * 60}ms`;

  const enlace = document.createElement("a");
  enlace.className = "enlace-lista";
  enlace.href = `player.html?id=${video.id}`;

  const imagen = document.createElement("img");
  imagen.className = "miniatura-lista";
  imagen.src = video.thumbnail;
  imagen.alt = video.titulo;
  imagen.loading = "lazy";
  enlace.append(imagen);

  const datos = document.createElement("section");
  datos.className = "datos-lista";

  const titulo = document.createElement("h3");
  titulo.className = "titulo-lista-video";
  const enlaceTitulo = document.createElement("a");
  enlaceTitulo.className = "enlace-titulo";
  enlaceTitulo.href = `player.html?id=${video.id}`;
  enlaceTitulo.textContent = video.titulo;
  titulo.append(enlaceTitulo);

  const canal = document.createElement("p");
  canal.className = "canal-lista";
  canal.textContent = video.canal;

  const vistas = document.createElement("p");
  vistas.className = "vistas-lista";
  vistas.textContent = formatearVistas(video.vistas);

  datos.append(titulo, canal, vistas);
  item.append(enlace, datos);
  return item;
}

function mostrarRecomendados(videos) {
  listaRecomendados.replaceChildren();
  videos.forEach((video, posicion) => {
    listaRecomendados.append(crearItemLista(video, posicion));
  });
}

async function cargarRecomendados() {
  const respuesta = await fetch(`${API_URL}/videos/${idVideo}/recomendados`);
  mostrarRecomendados(await respuesta.json());
}

function actualizarContador() {
  tituloComentarios.textContent = `${totalComentarios} comentarios`;
}

function crearComentario(comentario) {
  const item = document.createElement("article");
  item.className = "comentario";

  const cabecera = document.createElement("header");
  cabecera.className = "cabecera-comentario";

  const autor = document.createElement("strong");
  autor.textContent = comentario.autor;

  const fecha = document.createElement("time");
  fecha.dateTime = comentario.fecha;
  fecha.textContent = new Date(comentario.fecha).toLocaleString("es-EC");

  cabecera.append(autor, fecha);

  const texto = document.createElement("p");
  texto.className = "texto-comentario";
  texto.textContent = comentario.texto;

  item.append(cabecera, texto);
  return item;
}

async function cargarComentarios() {
  const respuesta = await fetch(`${API_URL}/videos/${idVideo}/comentarios`);
  const comentarios = await respuesta.json();
  listaComentarios.replaceChildren();
  comentarios.forEach((comentario) => {
    listaComentarios.append(crearComentario(comentario));
  });
  totalComentarios = comentarios.length;
  actualizarContador();
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const autor = inputAutor.value.trim();
  const texto = inputTexto.value.trim();
  if (!autor || !texto) {
    return;
  }

  const respuesta = await fetch(`${API_URL}/videos/${idVideo}/comentarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ autor, texto }),
  });
  const nuevo = await respuesta.json();
  listaComentarios.prepend(crearComentario(nuevo));
  totalComentarios += 1;
  actualizarContador();
  formulario.reset();
});

async function iniciar() {
  const respuesta = await fetch(`${API_URL}/videos/${idVideo}`);
  if (!respuesta.ok) {
    tituloVideo.textContent = "Video no encontrado";
    return;
  }
  mostrarVideo(await respuesta.json());
  cargarRecomendados();
  cargarComentarios();
}

iniciar();
