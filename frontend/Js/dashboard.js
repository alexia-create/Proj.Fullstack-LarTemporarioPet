document.addEventListener('DOMContentLoaded', async () => {
  if (!isLogado()) {
    window.location.href = 'login.html';
    return;
  }

  const usuario = getUsuarioLogado();
  document.getElementById('userName').textContent = usuario.nome_completo || usuario.nome || 'Usuário';
  document.getElementById('userNameMain').textContent = usuario.nome_completo || usuario.nome || 'Voluntário';

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

    const statsCards = document.querySelectorAll('.row.g-4.mb-4 .card h3');
    if (statsCards.length >= 4) {
      statsCards[0].textContent = stats.hospedagens_ativas || 0;
      statsCards[1].textContent = stats.animais_ajudados || 0;
      statsCards[2].textContent = stats.solicitacoes_pendentes || 0;
      statsCards[3].textContent = stats.avaliacao_media ? stats.avaliacao_media.toFixed(1) : '0.0';
    }

    const mensagensBadge = document.querySelector('.sidebar a[href="#mensagens"] .badge');
    if (mensagensBadge) {
      mensagensBadge.textContent = '0';
    }
  } catch (error) {
    console.error('[v0] Erro ao carregar stats:', error);
  }

  function showSection(hash) {
    if (!hash || hash === '#dashboard') {
      loadSolicitacoesPendentes();
      loadHospedagensAtivas();
    } else if (hash === '#solicitações') {
      loadSolicitacoesPendentes();
    } else if (hash === '#hospedagens') {
      loadHospedagensAtivas();
    } else if (hash === '#historico') {
      loadHistorico();
    } else if (hash === '#mensagens') {
      loadMensagens();
    } else if (hash === '#avaliacoes') {
      loadAvaliacoes();
    }
  }

  window.addEventListener('hashchange', () => {
    showSection(window.location.hash);
  });

  const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Initial section load
  showSection(window.location.hash);

  // Load initial data
  await loadSolicitacoesPendentes();
  await loadHospedagensAtivas();
});

async function loadHospedagensAtivas() {
  const usuario = getUsuarioLogado();
  try {
    const perfil = await API.obterPerfilVoluntarioDoUsuario(usuario.id);
    const solicitacoes = await API.listarSolicitacoesVoluntario(perfil.id);
    const ativas = solicitacoes.filter(s => s.status_solicitacao === 'aprovada' || s.status_solicitacao === 'em_andamento');

    const tbody = document.querySelector('.card-header:has(+ .card-body .table-responsive) + .card-body tbody');
    if (tbody) {
      if (ativas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma hospedagem ativa no momento</td></tr>';
      } else {
        tbody.innerHTML = '';
        ativas.forEach(sol => {
          const row = document.createElement('tr');
          const dataInicio = new Date(sol.data_inicio_prevista);
          const dataFim = new Date(sol.data_fim_prevista);
          const duracao = Math.ceil((dataFim - dataInicio) / (1000 * 60 * 60 * 24 * 30));
          
          row.innerHTML = `
            <td>
              <div class="d-flex align-items-center">
                <img src="/a-cute-pet.png" class="rounded-circle me-2" alt="${sol.nome_animal}" width="40">
                <span>${sol.nome_animal}</span>
              </div>
            </td>
            <td><span class="badge bg-primary">${sol.tipo_animal}</span></td>
            <td>${dataInicio.toLocaleDateString('pt-BR')}</td>
            <td>${duracao} ${duracao === 1 ? 'mês' : 'meses'}</td>
            <td><span class="badge bg-success">${sol.status_solicitacao}</span></td>
            <td>
              <button class="btn btn-sm btn-outline-primary" onclick="verDetalhesSolicitacao(${sol.id})">Ver Detalhes</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }
    }
  } catch (error) {
    console.error('[v0] Erro ao carregar hospedagens ativas:', error);
  }
}

async function loadSolicitacoesPendentes() {
  const usuario = getUsuarioLogado();
  try {
    const perfil = await API.obterPerfilVoluntarioDoUsuario(usuario.id);
    const solicitacoes = await API.listarSolicitacoesVoluntario(perfil.id);
    const pendentes = solicitacoes.filter(s => s.status_solicitacao === 'pendente');

    const solicitacoesList = document.querySelector('.solicitacoesList');
    if (solicitacoesList) {
      if (pendentes.length === 0) {
        solicitacoesList.innerHTML = '<div class="alert alert-info"><i class="bi bi-info-circle"></i> Nenhuma solicitação pendente no momento.</div>';
      } else {
        solicitacoesList.innerHTML = '';
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        
        pendentes.forEach(sol => {
          const item = document.createElement('div');
          item.className = 'list-group-item';
          item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-1">${sol.nome_completo} solicita hospedar ${sol.nome_animal}</h6>
              <small>${new Date(sol.data_solicitacao).toLocaleDateString('pt-BR')}</small>
            </div>
            <p class="mb-1 text-muted">${sol.mensagem_solicitante || 'Sem mensagem'}</p>
            <p class="mb-1"><strong>Animal:</strong> ${sol.tipo_animal} - ${sol.porte}</p>
            <p class="mb-1"><strong>Período:</strong> ${new Date(sol.data_inicio_prevista).toLocaleDateString('pt-BR')} até ${new Date(sol.data_fim_prevista).toLocaleDateString('pt-BR')}</p>
            <div class="mt-2">
              <button class="btn btn-sm btn-success" onclick="aprovarSolicitacao(${sol.id})">Aprovar</button>
              <button class="btn btn-sm btn-danger" onclick="recusarSolicitacao(${sol.id})">Recusar</button>
              <button class="btn btn-sm btn-outline-primary" onclick="verPerfilSolicitante(${sol.solicitante_id})">Ver Perfil</button>
            </div>
          `;
          listGroup.appendChild(item);
        });
        
        solicitacoesList.appendChild(listGroup);
      }
    }
  } catch (error) {
    console.error('[v0] Erro ao carregar solicitações:', error);
    const solicitacoesList = document.querySelector('.solicitacoesList');
    if (solicitacoesList) {
      solicitacoesList.innerHTML = '<div class="alert alert-danger">Erro ao carregar solicitações</div>';
    }
  }
}

async function loadHistorico() {
  const usuario = getUsuarioLogado();
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
    const perfil = await API.obterPerfilVoluntarioDoUsuario(usuario.id);
    const solicitacoes = await API.listarSolicitacoesVoluntario(perfil.id);
    const concluidas = solicitacoes.filter(s => s.status_solicitacao === 'concluida' || s.status_solicitacao === 'cancelada');
    
    const container = document.getElementById('historicoContainer');
    if (concluidas.length === 0) {
      container.innerHTML = '<div class="alert alert-info">Nenhuma hospedagem concluída ainda.</div>';
    } else {
      const listGroup = document.createElement('div');
      listGroup.className = 'list-group';
      concluidas.forEach(sol => {
        const statusClass = sol.status_solicitacao === 'concluida' ? 'success' : 'secondary';
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
          <div class="d-flex w-100 justify-content-between">
            <h6 class="mb-1">${sol.nome_animal} - Solicitado por ${sol.nome_completo}</h6>
            <small>${new Date(sol.data_solicitacao).toLocaleDateString('pt-BR')}</small>
          </div>
          <p class="mb-1">Status: <span class="badge bg-${statusClass}">${sol.status_solicitacao}</span></p>
          <p class="mb-1 text-muted small">Animal: ${sol.tipo_animal} - ${sol.porte}</p>
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
          Por enquanto, entre em contato diretamente com os solicitantes pelo telefone fornecido nas solicitações.
        </div>
      </div>
    `;
    document.querySelector('main').appendChild(mensagensSection);
  }
}

async function loadAvaliacoes() {
  const usuario = getUsuarioLogado();
  let avaliacoesSection = document.querySelector('#avaliacoesSection');
  if (!avaliacoesSection) {
    avaliacoesSection = document.createElement('div');
    avaliacoesSection.id = 'avaliacoesSection';
    avaliacoesSection.className = 'card border-0 shadow-sm mb-4';
    avaliacoesSection.innerHTML = `
      <div class="card-header bg-white border-bottom">
        <h5 class="mb-0">Minhas Avaliações</h5>
      </div>
      <div class="card-body">
        <div id="avaliacoesContainer">
          <div class="alert alert-info">Carregando avaliações...</div>
        </div>
      </div>
    `;
    document.querySelector('main').appendChild(avaliacoesSection);
  }

  try {
    const perfil = await API.obterPerfilVoluntarioDoUsuario(usuario.id);
    const avaliacoes = await API.listarAvaliacoesVoluntario(perfil.id);
    const mediaData = await API.obterMediaAvaliacoes(perfil.id);
    
    const container = document.getElementById('avaliacoesContainer');
    
    if (avaliacoes.length === 0) {
      container.innerHTML = `
        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i> Você ainda não possui avaliações. 
          Complete hospedagens para receber feedback dos solicitantes.
        </div>
      `;
    } else {
      // Show average rating
      const mediaHTML = `
        <div class="alert alert-success mb-3">
          <div class="d-flex align-items-center">
            <i class="bi bi-star-fill text-warning me-2" style="font-size: 2rem;"></i>
            <div>
              <h4 class="mb-0">${mediaData.media.toFixed(1)} / 5.0</h4>
              <small class="text-muted">${mediaData.total} ${mediaData.total === 1 ? 'avaliação' : 'avaliações'}</small>
            </div>
          </div>
        </div>
      `;
      
      // Show individual reviews
      const listGroup = document.createElement('div');
      listGroup.className = 'list-group';
      
      avaliacoes.forEach(av => {
        const stars = '⭐'.repeat(av.nota) + '☆'.repeat(5 - av.nota);
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
          <div class="d-flex w-100 justify-content-between mb-2">
            <h6 class="mb-0">${av.avaliador_nome}</h6>
            <small class="text-muted">${new Date(av.data_avaliacao).toLocaleDateString('pt-BR')}</small>
          </div>
          <div class="mb-2">
            <span style="font-size: 1.2rem;">${stars}</span>
            <span class="text-muted ms-2">${av.nota}/5</span>
          </div>
          ${av.comentario ? `<p class="mb-0 text-muted">${av.comentario}</p>` : '<p class="mb-0 text-muted fst-italic">Sem comentário</p>'}
        `;
        listGroup.appendChild(item);
      });
      
      container.innerHTML = mediaHTML;
      container.appendChild(listGroup);
    }
  } catch (error) {
    console.error('[v0] Erro ao carregar avaliações:', error);
    const container = document.getElementById('avaliacoesContainer');
    if (container) {
      container.innerHTML = '<div class="alert alert-danger">Erro ao carregar avaliações</div>';
    }
  }
}

async function aprovarSolicitacao(id) {
  try {
    await API.atualizarStatusSolicitacao(id, 'aprovada');
    alert('Solicitação aprovada com sucesso!');
    location.reload();
  } catch (error) {
    console.error('[v0] Erro ao aprovar:', error);
    alert('Erro ao aprovar solicitação');
  }
}

async function recusarSolicitacao(id) {
  try {
    await API.atualizarStatusSolicitacao(id, 'recusada');
    alert('Solicitação recusada.');
    location.reload();
  } catch (error) {
    console.error('[v0] Erro ao recusar:', error);
    alert('Erro ao recusar solicitação');
  }
}

function verDetalhesSolicitacao(id) {
  alert(`Ver detalhes da solicitação ${id} (funcionalidade em desenvolvimento)`);
}

function verPerfilSolicitante(id) {
  alert(`Ver perfil do solicitante ${id} (funcionalidade em desenvolvimento)`);
}
