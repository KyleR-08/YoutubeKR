const galeria = document.querySelector("#galeria");

function crearTarjeta(video, posicion) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-video";
  tarjeta.style.animationDelay = `${posicion * 60}ms`;

  const enlace = document.createElement("a");
  enlace.className = "miniatura";
  enlace.href = `player.html?id=${video.id}`;

  const imagen = document.createElement("img");
  imagen.className = "imagen-miniatura";
  imagen.src = video.thumbnail;
  imagen.alt = video.titulo;
  imagen.loading = "lazy";
  enlace.append(imagen);

  const info = document.createElement("header");
  info.className = "info-video";

  const foto = document.createElement("img");
  foto.className = "foto-canal";
  foto.src = "assets/img/perfil.jpg";
  foto.alt = video.canal;

  const texto = document.createElement("section");
  texto.className = "texto-video";

  const titulo = document.createElement("h2");
  titulo.className = "titulo-video";
  titulo.textContent = video.titulo;

  const canal = document.createElement("p");
  canal.className = "canal-video";
  canal.textContent = video.canal;

  const vistas = document.createElement("p");
  vistas.className = "vistas-video";
  vistas.textContent = formatearVistas(video.vistas);

  texto.append(titulo, canal, vistas);
  info.append(foto, texto);
  tarjeta.append(enlace, info);
  return tarjeta;
}

function mostrarVideos(videos) {
  galeria.replaceChildren();
  videos.forEach((video, posicion) => {
    galeria.append(crearTarjeta(video, posicion));
  });
}

async function cargarVideos() {
  const respuesta = await fetch(`${API_URL}/videos/?aleatorio=true`);
  const videos = await respuesta.json();
  mostrarVideos(videos);
}

cargarVideos();
