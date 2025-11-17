document.addEventListener('DOMContentLoaded', async () => {
  await buscarEExibirUsuarios();
  
  // Setup filters
  const searchLocation = document.getElementById('searchLocation');
  const petTypeFilter = document.getElementById('petTypeFilter');
  const animalPorte = document.getElementById('animalPorte');
  const idadeAnimal = document.getElementById('idadeAnimal');
  const sortBy = document.getElementById('sortBy');

  if (searchLocation) {
    searchLocation.addEventListener('input', buscarEExibirUsuarios);
  }
  if (petTypeFilter) {
    petTypeFilter.addEventListener('change', buscarEExibirUsuarios);
  }
  if (animalPorte) {
    animalPorte.addEventListener('change', buscarEExibirUsuarios);
  }
  if (idadeAnimal) {
    idadeAnimal.addEventListener('change', buscarEExibirUsuarios);
  }
  if (sortBy) {
    sortBy.addEventListener('change', buscarEExibirUsuarios);
  }
});

async function buscarEExibirUsuarios() {
  let listaDeUsuarios = [];
  
  try {
    const apiUrl = window.API_URL || (typeof API_URL !== 'undefined' ? API_URL : 'https://pousapet-backend.onrender.com');
    const url = `${apiUrl}/usuarios`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Endpoint não encontrado. Verifique se o backend está rodando e se a rota /voluntarios existe.');
      } else if (response.status === 500) {
        throw new Error('Erro no servidor. Verifique se o banco de dados está configurado corretamente.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    listaDeUsuarios = await response.json();

    const containerElement = document.getElementById('listaVolutarios');
    if (!containerElement) {
      console.error("[v0] Element 'listaVolutarios' not found");
      return;
    }
    
    containerElement.innerHTML = '';

    if (!listaDeUsuarios || listaDeUsuarios.length === 0) {
      containerElement.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center">
            <i class="bi bi-info-circle"></i> 
            <h5 class="mb-3">Nenhum voluntário encontrado</h5>
            <p>Ainda não há voluntários cadastrados no sistema.</p>
            <small class="text-muted">
              Se você é um desenvolvedor, execute os scripts SQL em backend/scripts/ para adicionar dados de teste.
            </small>
          </div>
        </div>
      `;
      const resultCount = document.getElementById('resultCount');
      if (resultCount) resultCount.textContent = '0';
      return;
    }

    listaDeUsuarios.forEach(usuario => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';
      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0 hover-shadow">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="card-title mb-1">${usuario.nome_completo || usuario.nome || 'Voluntário'}</h5>
                <p class="card-text small text-muted mb-0">
                  <i class="bi bi-geo-alt-fill text-primary"></i> ${usuario.cidade || 'Não informado'}, ${usuario.estado || 'PB'}
                </p>
              </div>
              <span class="badge bg-success">
                <i class="bi bi-patch-check-fill"></i> Ativo
              </span>
            </div>
            
            <p class="card-text fw-semibold mb-2">${usuario.titulo_perfil || 'Voluntário PousaPet'}</p>
            <p class="card-text text-muted small mb-3" style="min-height: 60px;">
              ${usuario.descricao_experiencia || usuario.email || 'Voluntário dedicado a ajudar animais necessitados'}
            </p>
            
            <div class="mb-3">
              <small class="d-block mb-2">
                <i class="bi bi-paw-fill text-primary"></i> 
                <strong>Aceita:</strong> ${usuario.tipo_pet_aceito || 'Todos os tipos'}
              </small>
              <small class="d-block mb-2">
                <i class="bi bi-rulers text-primary"></i> 
                <strong>Porte:</strong> ${usuario.porte_pet_aceito || 'Todos os portes'}
              </small>
              ${usuario.tipo_moradia ? `
              <small class="d-block">
                <i class="bi bi-house-fill text-primary"></i> 
                <strong>Moradia:</strong> ${usuario.tipo_moradia}
              </small>
              ` : ''}
              ${usuario.telefone ? `
              <small class="d-block mt-2">
                <i class="bi bi-telephone-fill text-primary"></i> 
                ${usuario.telefone}
              </small>
              ` : ''}
            </div>
          </div>
          <div class="card-footer bg-white border-top-0 pt-0">
            <button class="btn btn-primary btn-sm w-100" onclick="verDetalhesVoluntario(${usuario.id})">
              <i class="bi bi-eye"></i> Ver Perfil Completo
            </button>
          </div>
        </div>
      `;
      containerElement.appendChild(col);
    });

    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
      resultCount.textContent = listaDeUsuarios.length;
    }
    
  } catch (erro) {
    console.error("[v0] Erro ao buscar voluntários:", erro);
    const containerElement = document.getElementById('listaVolutarios');
    if (containerElement) {
      containerElement.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger" role="alert">
            <h5 class="alert-heading">
              <i class="bi bi-exclamation-triangle-fill"></i> 
              Erro ao carregar voluntários
            </h5>
            <p><strong>Mensagem:</strong> ${erro.message}</p>
            <hr>
            <p class="mb-2"><strong>Possíveis causas:</strong></p>
            <ul class="mb-0">
              <li>Backend não está rodando (verifique se ${window.API_URL || 'https://pousapet-backend.onrender.com'} está acessível)</li>
              <li>Banco de dados não está configurado corretamente</li>
              <li>Tabela Voluntarios_Perfis não existe no banco</li>
              <li>Problema de conexão com a internet</li>
            </ul>
            <hr>
            <small class="text-muted">
              <strong>Para desenvolvedores:</strong> Execute os scripts em backend/scripts/ para configurar o banco de dados.
            </small>
          </div>
        </div>
      `;
    }
  }
}

function verDetalhesVoluntario(id) {
  alert(`Visualizando detalhes do voluntário ID: ${id}\n\nFuncionalidade de detalhes em desenvolvimento.`);
}
