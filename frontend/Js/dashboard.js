const bootstrap = window.bootstrap

const petsData = [
  {
    id: 1,
    nome: "Thor",
    tipo: "cachorro",
    raca: "Golden Retriever",
    idade: 3,
    foto: "/golden-retriever.png",
  },
  {
    id: 2,
    nome: "Luna",
    tipo: "cachorro",
    raca: "Beagle",
    idade: 2,
    foto: "/beagle-dog.png",
  },
  {
    id: 3,
    nome: "Mia",
    tipo: "gato",
    raca: "Siamês",
    idade: 1,
    foto: "/siamese-cat.png",
  },
]

// Função para carregar animais
function loadPets(){
    const petsContainer = document.querySelector("#pets")
    petsContainer.innerHTML = ""

    petsData.forEach((pet) =>{
        const petCard = document.createElement("div")
        petCard.className = "card mb-3"
        petCard.innerHTML = `
        <div class="row g-0">
            <div class="col-md-4">
            <img src="${pet.foto}" class="img-fluid rounded-start" alt="${pet.nome}">
            </div>
            <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${pet.nome}</h5>
                <p class="card-text">Tipo: ${pet.tipo}</p>
                <p class="card-text">Raça: ${pet.raca}</p>
                <p class="card-text">Idade: ${pet.idade}</p>
                <button class="btn btn-primary" onclick="editPet(${pet.id})">Editar</button>
                <button class="btn btn-danger" onclick="deletePet(${pet.id})">Remover</button>
            </div>
            </div>
        </div>
        `
        petsContainer.appendChild(petCard)
    })
}

// Checa se o usuário esta logado
function checkAuth(){
    const userData = localStorage.getItem("userData") || sessionStorage.getItem("userData")

    if(!userData){
        // Redireciona para o login se não estiver autenticado
        window.location.href = "login.html"
        return false
    }

    return true
}

function loadHospedagensAtivas(){
    const hospedagensContainer = document.querySelector("#hospedagens")

    const hospedagens = [
        {
            id: 1,
            animal_nome:"Thor",
            animal_tipo:"cachorro",
            data_inicio:"2025-11-09",
            duracao_prevista: "2 meses",
            status: "ativa",
        },
    ]

    console.log("Hospedagens ativas carregadas:", hospedagens.length)
}

// Carrega avaliações
function loadAvaliacoes(){
    const avaliacoes = [
        {
            id:1,
            avaliador: "Equipe PousaPet",
            nota:6,
            comentario: "Volutário excelente! Thor está muito bem cuidado.",
            data: "2025-11-15",
        },
    ]

    console.log("Avaliações carregadas:", avaliacoes.length)
}

// Adicionar Animal
document.getElementById("savePetBtn")?.addEventListener("click", () =>{
    const nome = document.getElementById("petName").value
    const tipo = document.getElementById("petType").value
    const raca = document.getElementById("petBreed").value
    const idade = Number.parseInt(document.getElementById("petAge").value)
    const foto = document.getElementById("petPhoto").files[0]

    if(!nome || !tipo || !raca || !idade){
        showDashboardToast("Por favor, preencha todos os campos", "warning")
        return
    }

    // Upload e salvamento da foto no BD

    const newPet = {
        id: petsData.length + 1,
        nome,
        tipo,
        raca,
        idade,
        foto: foto ? URL.createObjectURL(foto) :  `/placeholder.svg?height=200&width=300&query=${tipo}`,
    }

    petsData.push(newPet)
    loadPets()

    showDashboardToast(`${nome} foi adicionado com sucesso!`, "success")

    // Fecha o modal e reseta o form
    const modal = bootstrap.Modal.getInstance(document.getElementById("addPetModal"))
    modal.hide()
    document.getElementById("addPetForm").reset()
})

// Editar Animal
function editPet(id){
    const pet = petsData.find((p) => p.id === id)
    if(pet){
        alert(`Editar ${pet.nome}\n\nAqui irá abrir um modal para editar os dados atuais do animal.`)
    }
}
function deletePet(id) {
  const pet = petsData.find((p) => p.id === id)
  if (pet && confirm(`Tem certeza que deseja remover ${pet.nome}?`)) {
    const index = petsData.findIndex((p) => p.id === id)
    petsData.splice(index, 1)
    loadPets()
    showDashboardToast(`${pet.nome} foi removido`, "info")
  }
}

// Toast for Dashboard
function showDashboardToast(message, type = "info") {
  let toastContainer = document.getElementById("toastContainer")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toastContainer"
    toastContainer.className = "position-fixed top-0 end-0 p-3"
    toastContainer.style.zIndex = "9999"
    document.body.appendChild(toastContainer)
  }

  const toastId = "toast-" + Date.now()
  const bgClass =
    type === "success" ? "bg-success" : type === "warning" ? "bg-warning" : type === "danger" ? "bg-danger" : "bg-info"

  const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `

  toastContainer.insertAdjacentHTML("beforeend", toastHTML)

  const toastElement = document.getElementById(toastId)
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 })
  toast.show()

  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove()
  })
}

// Sidebar active state
document.querySelectorAll(".sidebar .nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    document.querySelectorAll(".sidebar .nav-link").forEach((l) => l.classList.remove("active"))
    this.classList.add("active")
  })
})

// Inicia dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  if (checkAuth()) {
    loadHospedagensAtivas()
    loadAvaliacoes()

    // Carrega nome de usuário
    const userData = JSON.parse(localStorage.getItem("userData") || sessionStorage.getItem("userData"))
    if (userData && userData.nome) {
      const welcomeText = document.querySelector("h1.h2")
      if (welcomeText) {
        welcomeText.textContent = `Bem-vindo, ${userData.nome.split(" ")[0]}!`
      }
    }

    // Carrega Animais na inicialização
    loadPets()
  }
})

console.log("Dashboard.js Carregado com sucesso!")
