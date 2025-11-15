document.addEventListener('DOMContentLoaded', () => {

    carregarGaleriaDePets();

});

async function carregarGaleriaDePets() {
    const galeria = document.getElementById('petGallery');

    try {

        const response = await fetch('http://localhost:3000/animais');

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }


        const animais = await response.json();


        galeria.innerHTML = '';


        if (animais.length === 0) {
            galeria.innerHTML = '<p class="text-center text-muted">Nenhum animalzinho cadastrado para lar temporário no momento. 😢</p>';
            return;
        }


        animais.forEach(animal => {

            const imgPlaceholder = (animal.tipo_animal === 'cachorro')
                ? 'assets/madison-podjasek-NqVTVUWrC0M-unsplash.jpg'
                : 'assets/ayla-verschueren-7ski9cyE6UA-unsplash.jpg';

            const cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${imgPlaceholder}" class="card-img-top" alt="Foto do ${animal.nome_animal}" style="height: 250px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-primary">${animal.nome_animal}</h5>
                            <p class="card-text">
                                <span class="badge bg-secondary me-1">${animal.tipo_animal}</span>
                                <span class="badge bg-info">${animal.porte}</span>
                            </p>
                            <a href="#" class="btn btn-primary">Ver Detalhes</a>
                        </div>
                    </div>
                </div>
            `;


            galeria.insertAdjacentHTML('beforeend', cardHtml);
        });

    } catch (error) {
        console.error('Erro ao carregar galeria de pets:', error);
        galeria.innerHTML = '<p class="text-center text-danger">Ops! Não conseguimos carregar a galeria de pets. Tente novamente mais tarde.</p>';
    }
}