// CHANGE: Home page - gallery loading
document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  if (isLogado()) {
    const usuarioLogado = getUsuarioLogado();
    const tipoUsuario = getTipoUsuario();
    
    // Update navbar buttons
    const loginBtn = document.querySelector('a[href="login.html"]');
    const cadastroBtn = document.querySelector('a[href="cadastro.html"]');
    
    if (loginBtn && cadastroBtn) {
      loginBtn.textContent = 'Dashboard';
      loginBtn.href = tipoUsuario === 'voluntario' ? 'dashboard.html' : 'dashboard-solicitante.html';
      cadastroBtn.remove();
    }
  }

  // Load pet gallery
  const petGallery = document.getElementById('petGallery');
  if (petGallery) {
    try {
      const animais = await API.listarAnimais();
      petGallery.innerHTML = '';

      if (animais.length === 0) {
        petGallery.innerHTML = '<p class="text-center">Nenhum animal disponível no momento.</p>';
        return;
      }

      animais.slice(0, 6).forEach(animal => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
          <div class="card h-100 shadow-sm border-0">
            <img src="/--animal-nome-animal-.jpg" class="card-img-top" alt="${animal.nome_animal}">
            <div class="card-body">
              <h5 class="card-title">${animal.nome_animal}</h5>
              <p class="card-text text-muted">
                <i class="bi bi-paw"></i> ${animal.tipo_animal} | 
                <i class="bi bi-rulers"></i> ${animal.porte}
              </p>
            </div>
            <div class="card-footer bg-white border-top-0">
              <a href="animais.html" class="btn btn-sm btn-primary">Ver Detalhes</a>
            </div>
          </div>
        `;
        petGallery.appendChild(card);
      });
    } catch (error) {
      console.error('Erro ao carregar gallery:', error);
    }
  }
});
