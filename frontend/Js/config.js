// CHANGE: API configuration file - centralized backend URL and constants
const API_URL = 'https://pousapet-backend.onrender.com';

// Token management
function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

function getUsuarioLogado() {
  const usuario = localStorage.getItem('usuarioLogado');
  return usuario ? JSON.parse(usuario) : null;
}

function setUsuarioLogado(usuario) {
  localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
}

function getTipoUsuario() {
  return localStorage.getItem('tipoUsuario');
}

function setTipoUsuario(tipo) {
  localStorage.setItem('tipoUsuario', tipo);
}

function isLogado() {
  return !!getToken();
}
