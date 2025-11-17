// CHANGE: Volunteer list page with filters - improved error handling
document.addEventListener('DOMContentLoaded', async () => {
  console.log("[v0] Animais.js loaded");
  
  const listaVoluntarios = document.getElementById('listaVolutarios');

  async function carregarVoluntarios() {
    try {
      console.log("[v0] Loading volunteers...");
      const voluntarios = await API.listarVoluntarios();
      console.log("[v0] Volunteers loaded:", voluntarios);
      
      if (!voluntarios || voluntarios.length === 0) {
        listaVoluntarios.innerHTML = '<p class="col-12 text-center text-muted">Nenhum voluntário disponível no momento.</p>';
        document.getElementById('resultCount').textContent = '0';
        return;
      }

      listaVoluntarios.innerHTML = '';
      voluntarios.forEach(voluntario => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title">${voluntario.nome_completo || 'Voluntário'}</h5>
                  <p class="card-text small text-muted">
                    <i class="bi bi-geo-alt"></i> ${voluntario.cidade || 'Não informado'}, ${voluntario.estado || 'PB'}
                  </p>
                </div>
                <span class="badge bg-success">Verificado</span>
              </div>
              
              <p class="card-text"><strong>${voluntario.titulo_perfil || 'Voluntário Ativo'}</strong></p>
              <p class="card-text text-muted small">${voluntario.descricao_experiencia || 'Voluntário dedicado a ajudar animais'}</p>
              
              <div class="mb-3">
                <small class="text-muted d-block mb-2">
                  <i class="bi bi-paw"></i> <strong>Aceita:</strong> ${voluntario.tipo_pet_aceito || 'Não especificado'}
                </small>
                <small class="text-muted d-block mb-2">
                  <i class="bi bi-rulers"></i> <strong>Porte:</strong> ${voluntario.porte_pet_aceito || 'Todos'}
                </small>
                <small class="text-muted">
                  <i class="bi bi-house"></i> <strong>Moradia:</strong> ${voluntario.tipo_moradia || 'Não informado'}
                </small>
              </div>
            </div>
            <div class="card-footer bg-white border-top-0">
              <a href="#" class="btn btn-primary btn-sm w-100" onclick="verDetalhesVoluntario(${voluntario.id})">
                Ver Perfil
              </a>
            </div>
          </div>
        `;
        listaVoluntarios.appendChild(card);
      });

      document.getElementById('resultCount').textContent = voluntarios.length;
    } catch (error) {
      console.error('[v0] Erro ao carregar voluntários:', error);
      listaVoluntarios.innerHTML = '<p class="col-12 text-danger"><i class="bi bi-exclamation-triangle"></i> Erro ao carregar voluntários. Tente novamente mais tarde.</p>';
    }
  }

  // Filtros
  const searchLocation = document.getElementById('searchLocation');
  const petTypeFilter = document.getElementById('petTypeFilter');
  const animalPorte = document.getElementById('animalPorte');
  const idadeAnimal = document.getElementById('idadeAnimal');

  if (searchLocation) {
    searchLocation.addEventListener('change', () => {
      console.log("[v0] Filter by location:", searchLocation.value);
      carregarVoluntarios();
    });
  }
  if (petTypeFilter) {
    petTypeFilter.addEventListener('change', () => {
      console.log("[v0] Filter by pet type:", petTypeFilter.value);
      carregarVoluntarios();
    });
  }
  if (animalPorte) {
    animalPorte.addEventListener('change', () => {
      console.log("[v0] Filter by size:", animalPorte.value);
      carregarVoluntarios();
    });
  }
  if (idadeAnimal) {
    idadeAnimal.addEventListener('change', () => {
      console.log("[v0] Filter by age:", idadeAnimal.value);
      carregarVoluntarios();
    });
  }

  carregarVoluntarios();
});

function verDetalhesVoluntario(id) {
  console.log("[v0] Viewing volunteer details:", id);
  window.location.href = `voluntario-detalhes.html?id=${id}`;
}
