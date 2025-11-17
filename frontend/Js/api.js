// CHANGE: API wrapper functions for all backend endpoints
const API = {
  // Autenticação
  login: async (email, senha) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    return response.json();
  },

  registrar: async (userData) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Animais
  criarAnimal: async (animalData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/animais`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(animalData)
    });
    return response.json();
  },

  listarAnimais: async () => {
    const response = await fetch(`${API_URL}/animais`);
    return response.json();
  },

  obterAnimal: async (id) => {
    const response = await fetch(`${API_URL}/animais/${id}`);
    return response.json();
  },

  atualizarAnimal: async (id, animalData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/animais/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(animalData)
    });
    return response.json();
  },

  deletarAnimal: async (id) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/animais/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Voluntários
  criarPerfilVoluntario: async (perfilData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/voluntarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(perfilData)
    });
    return response.json();
  },

  listarVoluntarios: async () => {
    const response = await fetch(`${API_URL}/voluntarios`);
    return response.json();
  },

  obterVoluntario: async (id) => {
    const response = await fetch(`${API_URL}/voluntarios/${id}`);
    return response.json();
  },

  obterPerfilVoluntarioDoUsuario: async (usuarioId) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/voluntarios/usuario/${usuarioId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Solicitações
  criarSolicitacao: async (solicitacaoData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/solicitacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(solicitacaoData)
    });
    return response.json();
  },

  listarSolicitacoesVoluntario: async (voluntarioId) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/solicitacoes/voluntario/${voluntarioId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  listarSolicitacoesSolicitante: async (solicitanteId) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/solicitacoes/solicitante/${solicitanteId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  atualizarStatusSolicitacao: async (id, status) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/solicitacoes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status_solicitacao: status })
    });
    return response.json();
  }
};
