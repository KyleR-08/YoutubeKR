const API_URL = "http://127.0.0.1:8000";

function formatearVistas(numero) {
  if (numero >= 1000000) {
    return `${(numero / 1000000).toFixed(1)} M vistas`;
  }
  if (numero >= 1000) {
    return `${Math.round(numero / 1000)} k vistas`;
  }
  return `${numero} vistas`;
}
