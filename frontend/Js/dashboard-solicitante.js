document.addEventListener('DOMContentLoaded', async () => {
  if (!isLogado()) {
    window.location.href = 'login.html';
    return;
  }

  const usuario = getUsuarioLogado();
  document.getElementById('userName').textContent = usuario.nome_completo || usuario.nome || 'Usuário';
  document.getElementById('userNameMain').textContent = usuario.nome_completo || usuario.nome || 'Solicitante';

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      clearToken();
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('tipoUsuario');
      window.location.href = 'index.html';
    });
  }

  try {
    const stats = await fetch(`${API_URL}/dashboard/stats/${usuario.id}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    }).then(r => r.json());

    // Update stats cards
    const statsCards = document.querySelectorAll('.row.g-4.mb-4 .card h3');
    if (statsCards.length >= 4) {
      statsCards[0].textContent = stats.animais_cadastrados || 0;
      statsCards[1].textContent = stats.em_lar_temporario || 0;
      statsCards[2].textContent = stats.aguardando_lar || 0;
      statsCards[3].textContent = stats.adotados || 0;
    }
  } catch (error) {
    console.error('[v0] Erro ao carregar stats:', error);
  }

  function showSection(hash) {
    // Hide all sections
    const allSections = document.querySelectorAll('.card.border-0.shadow-sm');
    
    // Show dashboard by default or based on hash
    if (!hash || hash === '#dashboard') {
      // Show quick actions and stats (default view)
      loadMeusAnimais();
      loadSolicitacoes();
    } else if (hash === '#meus-animais') {
      loadMeusAnimais();
      // Scroll to meus animais section
      const meusAnimaisSection = document.querySelector('.card-header:has(+ .card-body .table-responsive)');
      if (meusAnimaisSection) {
        meusAnimaisSection.closest('.card').scrollIntoView({ behavior: 'smooth' });
      }
    } else if (hash === '#solicitacoes') {
      loadSolicitacoes();
      // Scroll to solicitacoes section
      const solicitacoesSection = document.querySelector('#solicitacoesContainer');
      if (solicitacoesSection) {
        solicitacoesSection.closest('.card').scrollIntoView({ behavior: 'smooth' });
      }
    } else if (hash === '#historico') {
      loadHistorico();
    } else if (hash === '#mensagens') {
      loadMensagens();
    }
  }

  window.addEventListener('hashchange', () => {
    showSection(window.location.hash);
  });

  const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Remove active class from all links
      sidebarLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      link.classList.add('active');
    });
  });

  // Initial section load
  showSection(window.location.hash);

  // Load initial data
  await loadMeusAnimais();
  await loadSolicitacoes();

  // Add animal form
  const btnSaveAnimal = document.getElementById('btnSaveAnimal');
  if (btnSaveAnimal) {
    btnSaveAnimal.addEventListener('click', async () => {
      const animalData = {
        nome_animal: document.getElementById('animalNome').value,
        tipo_animal: document.getElementById('animalTipo').value,
        porte: document.getElementById('animalPorte').value,
        idade_aproximada: document.getElementById('animalIdade').value,
        historia_animal: document.getElementById('animalDescricao').value,
        cuidados_especiais: document.getElementById('animalSaude').value,
        solicitante_id: usuario.id
      };

      try {
        const response = await API.criarAnimal(animalData);
        if (response.error) {
          alert('Erro: ' + response.error);
        } else {
          alert('Animal cadastrado com sucesso!');
          // Close modal
          const modal = bootstrap.Modal.getInstance(document.getElementById('addAnimalModal'));
          if (modal) modal.hide();
          // Reload data
          location.reload();
        }
      } catch (error) {
        console.error('[v0] Erro ao criar animal:', error);
        alert('Erro ao cadastrar animal: ' + error.message);
      }
    });
  }
});

async function loadMeusAnimais() {
  const usuario = getUsuarioLogado();
  try {
    const animais = await API.listarAnimais();
    const userAnimals = animais.filter(a => a.solicitante_id === usuario.id);

    const tabelaBody = document.getElementById('animaisTableBody');
    if (tabelaBody) {
      if (userAnimals.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum animal cadastrado ainda</td></tr>';
      } else {
        tabelaBody.innerHTML = '';
        userAnimals.forEach(animal => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>
              <div class="d-flex align-items-center">
                <img src="/a-cute-pet.png" class="rounded-circle me-2" alt="${animal.nome_animal}" width="40">
                <span>${animal.nome_animal}</span>
              </div>
            </td>
            <td><span class="badge bg-primary">${animal.tipo_animal}</span></td>
            <td>${animal.porte}</td>
            <td><span class="badge bg-warning text-dark">${animal.status || 'buscando_lar'}</span></td>
            <td>${new Date(animal.data_cadastro).toLocaleDateString('pt-BR')}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" onclick="verAnimal(${animal.id})">Ver</button>
              <button class="btn btn-sm btn-outline-secondary" onclick="editarAnimal(${animal.id})">Editar</button>
            </td>
          `;
          tabelaBody.appendChild(row);
        });
      }
    }
  } catch (error) {
    console.error('[v0] Erro ao carregar animais:', error);
    const tabelaBody = document.getElementById('animaisTableBody');
    if (tabelaBody) {
      tabelaBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar animais</td></tr>';
    }
  }
}

async function loadSolicitacoes() {
  const usuario = getUsuarioLogado();
  try {
    const solicitacoes = await API.listarSolicitacoesSolicitante(usuario.id);
    
    const solicitacoesContainer = document.getElementById('solicitacoesContainer');
    if (solicitacoesContainer) {
      if (solicitacoes.length === 0) {
        solicitacoesContainer.innerHTML = '<div class="alert alert-info"><i class="bi bi-info-circle"></i> Você ainda não recebeu nenhuma solicitação de voluntários.</div>';
      } else {
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        
        solicitacoes.forEach(sol => {
          const item = document.createElement('div');
          item.className = 'list-group-item';
          const statusBadge = sol.status_solicitacao === 'pendente' ? 'warning' : 
                             sol.status_solicitacao === 'aprovada' ? 'success' : 'danger';
          item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-1">${sol.voluntario_nome} quer hospedar ${sol.nome_animal}</h6>
              <small>${new Date(sol.data_solicitacao).toLocaleDateString('pt-BR')}</small>
            </div>
            <p class="mb-1 text-muted">Status: <span class="badge bg-${statusBadge}">${sol.status_solicitacao}</span></p>
            ${sol.status_solicitacao === 'pendente' ? `
            <div class="mt-2">
              <button class="btn btn-sm btn-success" onclick="aprovarSolicitacao(${sol.id})">Aprovar</button>
              <button class="btn btn-sm btn-danger" onclick="recusarSolicitacao(${sol.id})">Recusar</button>
              <button class="btn btn-sm btn-outline-primary">Ver Perfil</button>
            </div>
            ` : ''}
          `;
          listGroup.appendChild(item);
        });
        
        solicitacoesContainer.innerHTML = '';
        solicitacoesContainer.appendChild(listGroup);
      }
    }
  } catch (error) {
    console.error('[v0] Erro ao carregar solicitações:', error);
    const solicitacoesContainer = document.getElementById('solicitacoesContainer');
    if (solicitacoesContainer) {
      solicitacoesContainer.innerHTML = '<div class="alert alert-danger">Erro ao carregar solicitações</div>';
    }
  }
}

async function loadHistorico() {
  const usuario = getUsuarioLogado();
  // Create or find historico section
  let historicoSection = document.querySelector('#historicoSection');
  if (!historicoSection) {
    historicoSection = document.createElement('div');
    historicoSection.id = 'historicoSection';
    historicoSection.className = 'card border-0 shadow-sm mb-4';
    historicoSection.innerHTML = `
      <div class="card-header bg-white border-bottom">
        <h5 class="mb-0">Histórico de Hospedagens</h5>
      </div>
      <div class="card-body">
        <div id="historicoContainer">
          <div class="alert alert-info">Carregando histórico...</div>
        </div>
      </div>
    `;
    document.querySelector('main').appendChild(historicoSection);
  }

  try {
    const solicitacoes = await API.listarSolicitacoesSolicitante(usuario.id);
    const concluidas = solicitacoes.filter(s => s.status_solicitacao === 'concluida' || s.status_solicitacao === 'cancelada');
    
    const container = document.getElementById('historicoContainer');
    if (concluidas.length === 0) {
      container.innerHTML = '<div class="alert alert-info">Nenhuma hospedagem concluída ainda.</div>';
    } else {
      const listGroup = document.createElement('div');
      listGroup.className = 'list-group';
      concluidas.forEach(sol => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
          <div class="d-flex w-100 justify-content-between">
            <h6 class="mb-1">${sol.nome_animal} - Hospedado por ${sol.voluntario_nome}</h6>
            <small>${new Date(sol.data_solicitacao).toLocaleDateString('pt-BR')}</small>
          </div>
          <p class="mb-1">Status: <span class="badge bg-secondary">${sol.status_solicitacao}</span></p>
        `;
        listGroup.appendChild(item);
      });
      container.innerHTML = '';
      container.appendChild(listGroup);
    }
  } catch (error) {
    console.error('[v0] Erro ao carregar histórico:', error);
  }
}

async function loadMensagens() {
  // Create or find mensagens section
  let mensagensSection = document.querySelector('#mensagensSection');
  if (!mensagensSection) {
    mensagensSection = document.createElement('div');
    mensagensSection.id = 'mensagensSection';
    mensagensSection.className = 'card border-0 shadow-sm mb-4';
    mensagensSection.innerHTML = `
      <div class="card-header bg-white border-bottom">
        <h5 class="mb-0">Minhas Mensagens</h5>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i> Sistema de mensagens em desenvolvimento. 
          Por enquanto, entre em contato diretamente com os voluntários pelo telefone fornecido.
        </div>
      </div>
    `;
    document.querySelector('main').appendChild(mensagensSection);
  }
}

function verAnimal(id) {
  alert('Detalhes do animal ' + id + ' - Funcionalidade em desenvolvimento');
}

function editarAnimal(id) {
  alert('Editar animal ' + id + ' - Funcionalidade em desenvolvimento');
}

async function aprovarSolicitacao(id) {
  try {
    await API.atualizarStatusSolicitacao(id, 'aprovada');
    alert('Solicitação aprovada!');
    location.reload();
  } catch (error) {
    console.error('[v0] Erro ao aprovar:', error);
    alert('Erro ao aprovar solicitação');
  }
}

async function recusarSolicitacao(id) {
  try {
    await API.atualizarStatusSolicitacao(id, 'recusada');
    alert('Solicitação recusada!');
    location.reload();
  } catch (error) {
    console.error('[v0] Erro ao recusar:', error);
    alert('Erro ao recusar solicitação');
  }
}
