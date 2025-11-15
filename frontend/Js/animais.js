const bootstrap = window.bootstrap

//exemplo do banco de dados de animais
const animaisData = [
    {
        id:1,
        nome:"Thor",
        tipo:"cachorro",
        raca:"SRD (Sem Raça Definida)",
        idade_estimada:3,
        porte:"grande",
        descricao:"Thor é um cachorro muito dócil e carinhoso. Foi resgatado da rua com uma pata machucada, já tratada. Adoro brincar e se dá bem com crianças.",
        status:"diponivel",
        foto:"/rescued-large-brown-dog.jpg",
        condicoes_saude:"Vacinado, castrado, vermifugado",
        data_resgate:"2025-10-15",
        urgente: true,
    },
    {
        id:2,
        nome:"luna",
        tipo:"cachorro",
        raca:"Beagle",
        idade_estimada:2,
        porte:"medio",
        descricao:"Luna é uma cachorrinha muito ativa e brincalhona. Foi abandonada grávida e após ter seus filhotes (já adotados), está pronta para encontrar seu lar definitivo.",
        status:"diponivel",
        foto:"/beagle-dog-png",
        condicoes_saude:"Vacinada, castrada, todos os exames em dia",
        data_resgate:"2025-09-20",
        urgente: false,
    },
    {
        id:3,
        nome:"Mia",
        tipo:"gato",
        raca:"SRD",
        idade_estimada:1,
        porte:"pequeno",
        descricao:"Mia é uma gatinha tímida mas muito carinhosa quando ganha confiança. Foi resgatada de uma colônia e precisa de um lar tranquilo",
        status:"diponivel",
        foto:"/rescued-orange-cat.jpg",
        condicoes_saude:"Vacinada, castrada, todos os exames em dia",
        data_resgate:"2025-11-01",
        urgente: false,
    },
    {
        id:4,
        nome:"Bob",
        tipo:"cachorro",
        raca:"SRD",
        idade_estimada:5,
        porte:"grande",
        descricao:"Bob é um cachorro adulto muito calmo e educado. Seu tutor faleceu e ele precisa de um novo lar. Ótimo com crianças e outros animais.",
        status:"em_lar_temporario",
        foto:"/rescued-dog-brown.jpg",
        condicoes_saude:"Vacinado, castrado, tratamento para artrite controlado.",
        data_resgate:"2025-10-01",
        urgente: false,
    },
    {
        id:5,
        nome:"Nina",
        tipo:"gato",
        raca:"SRD",
        idade_estimada:4,
        porte:"pequeno",
        descricao:"Nina é uma gata elegante e independente. Foi resgatada após ser abandonada em mudança. Prefere ser a única gata da casa.",
        status:"disponivel",
        foto:"/rescued-cat.jpg",
        condicoes_saude:"Vacinada, castrada, saudável.",
        data_resgate:"2025-11-10",
        urgente: true,
    },
    {
        id: 6,
        nome: "Max",
        tipo: "cachorro",
        raca: "Pinscher",
        idade_estimada: 7,
        porte: "pequeno",
        descricao:
        "Max é um cachorrinho idoso muito amoroso. Foi resgatado de maus tratos e precisa de um lar que ofereça conforto em sua terceira idade.",
        status: "disponivel",
        foto: "/pinscher-dog.jpg",
        condicoes_saude: "Vacinado, castrado, precisa medicação diária para coração",
        data_resgate: "2025-09-05",
        urgente: true,
    },
    {
        id: 7,
        nome: "Bella",
        tipo: "cachorro",
        raca: "Poodle",
        idade_estimada: 4,
        porte: "pequeno",
        descricao:
        "Bella é uma cadelinha muito dócil e carinhosa. Foi resgatada de um canil clandestino. Adora colo e carinho.",
        status: "disponivel",
        foto: "/white-poodle.png",
        condicoes_saude: "Vacinada, castrada, em recuperação nutricional",
        data_resgate: "2025-10-20",
        urgente: false,
    },
    {
        id: 8,
        nome: "Simba",
        tipo: "gato",
        raca: "SRD",
        idade_estimada: 6,
        porte: "pequeno",
        descricao:
        "Simba é um gatão laranja muito amigável. Foi atropelado e após tratamento está 100% recuperado. Ama brincar com bolinhas.",
        status: "em_lar_temporario",
        foto: "/orange-tabby-cat.png",
        condicoes_saude: "Vacinado, castrado, recuperado completamente",
        data_resgate: "2024-08-15",
        urgente: false,
    },
]

let filteredAnimais = [...animaisData]
let currentAnimalId = null

//Carregamento de Animais
function loadAnimais(){
    const container = document.getElementById("animaisList")
    const resultCount = document.getElementById("resultCount")

    if(!container) return

    if(filteredAnimais.length === 0){
        container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h3 class="mt-3">Nenhum animal encontrado</h3>
                    <p class="text-muted">Tente ajustar os filtros de busca</p>
                </div>
            `
        resultCount.textContent = "0" 
        return
    }

    container.innerHTML = ""
    resultCount.textContent = filteredAnimais.length

    filteredAnimais.forEach((animal, index) =>{
        const col = document.createElement("div")
        col.className = "col-md-6 col-lg-4 fade-in"
        col.style.animationDelay = `${index * 0.1}s`

        const statusBadge = {
            disponivel:'<span class="badge bg-success">Disponível</span>',
            em_lar_temporario:'<span class="badge bg-warning text-dark">Em Lar Temporário</span',
            adotado:'<span class="badge bg-info">Adotado</span>',
        }

        const urgenteTag = animal.urgente
            ?'<span class="badge bg-danger position-absolute top-0 end-0 m-2"><i class="bi bi-exclamatio-triangle"></i> URGENTE</span>'
            :""
        col.innerHTML = `
                <div class="cuidador-card card border-0 shadow-sm h-100 position-relative">
                    ${urgenteTag}
                    <img src="${animal.foto}" class="card-img-top"
                    alt="${animal.nome}" style="height: 200px;object-fit: cover;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-star mb-2">
                            <h5 class="card-title mb-0">${animal.nome}</h5>
                            ${statusBadge[animal.status] || ""}
                        </div>
                        <p class="text-muted small mb-2">
                            <i class="bi bi-tag"></i> ${animal.raca} . ${animal.idade_estimada} ano${animal.idade_estimada > 1 ? "s" : ""}<br>
                            <i class="bi bi-rulers"></i> Porte ${animal.porte}
                        </p>
                        <p class="card-text text-muted small mb-3">${animal.descricao.substring(0.100)}...</p>

                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="bi bi-calendar"></i> ${new Date(animal.data_resgate).toLocaleDateString("pt-BR")}
                            </small>
                            <button class="btn btn-primary btn-sm onclick-"viewAnimalDetails(${animal.id})">
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                </div>
        
            `
        container.appendChild(col)
    })
}

//Filtrar Animais
function filterAnimais(){
    const animalType = document.getElementById("animalTypeFilter")?.value || ""
    const porte = document.getElementById("porteFilter")?.value || ""
    const idade = document.getElementById("idadeFilter")?.value || ""
    const status = document.getElementById("statusFilter")?.value || "disponivel"

    filteredAnimais = animaisData.filter((animal) =>{
        const matchType = !animalType || animal.tipo === animalType
        const matchPorte = !porte || animal.porte === porte

        let matchIdade = true
        if(idade === "filhote") matchIdade = animal.idade_estimada <= 1
        else if(idade === "adulto") matchIdade = animal.idade_estimada > 1 && animal.idade_estimada < 7
        else if(idade === "idoso") matchIdade = animal.idade_estimada >= 7

        const matchStatus = status === "todos" || animal.status === status

        return matchType && matchPorte && matchIdade && matchStatus
    })

    loadAnimais()
}

//Sort Animais
function sortAnimais(){
    const SortBy = document.getElementById("sortBy")?.value || "recent"

    switch(SortBy){
        case "urgent":
            filteredAnimais.sort((a, b) => (b.urgente ? 1 :0) - (a.urgente ? 1 : 0))
            break
        case "age-young":
            filteredAnimais.sort((a, b) => a.idade_estimada - b.idade_estimada)
            break
        case "age-old":
            filteredAnimais.sort((a, b) => b.idade_estimada - a.idade_estimada)
            break
        default:
            filteredAnimais.sort((a, b) => new Date(b.data_resgate) - new Date(a.data_resgate))
    }

    loadAnimais()
}

//Visualização dos detalhes do animal
function viewAnimalDetails(id){
    const animal = animaisData.find((a) => a.id === id)
    currentAnimalId = id

    if(animal){
        const modal = new bootstrap.Modal(document.getElementById("animalModal"))
        document.getElementById("animalModalTitle").textContent = `${animal.nome} - ${animal.tipo}`

        const statusBadge = {
            disponivel: '<span class="badge bg-success">Disponível para Lar Temporário</span>',
            em_lar_temporario:'<span class="badge bg-warning text-dark">Já está em Lar Temporário</span>',
            adotado:'<span class="badge bg-info">Já foi Adotado</span>',
        }

        document.getElementById("animalModalBody").innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${animal.foto}" class="img-fluid rouded mb-3" alt="${animal.nome}">
                </div>
                <div class="col-md-6">
                    <h5>${animal.nome}</h5>
                    ${statusBadge[animal.status]}
                    ${animal.urgente ? '<span class="badge bg-danger ms-2">URGENTE</span>' : ""}

                    <hr>

                    <p><strong>Tipo:</strong> ${animal.tipo === "cachorro" ? "Cachorro" : "Gato"}</p>
                    <p><strong>Raça:</strong> ${animal.raca}</p>
                    <p>
                    <p><strong>Idade estimada:</strong> ${animal.idade_estimada} ano${animal.idade_estimada > 1 ? "s" : ""}</p>
                    <p><strong>Porte:</strong> ${animal.porte}</p>
                    <p><strong>Data de resgate:</strong> ${new Date(animal.data_resgate).toLocaleDateString("pr-br")}</p>

                    <hr>

                    <h6>Condições de Saúde</h6>
                    <p class="text-muted">${animal.condicoes_saude}</p>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Sobre ${animal.nome}</h6>
                    <p>${animal.descricao}</p>
                </div>
            </div>
        `

    //Show/hide solicitar button baseado no status
    const btnSolicitar = document.getElementById("btnSolicitarHospedagem")
    if(animal.status === "disponivel"){
        btnSolicitar.style.display = "block"
    }else{
        btnSolicitar.style.display = "none"
    }

    modal.show()
    }
}

//Solicitar Hospedagem
document.getElementById("btnSolicitarHospedagem")?.addEventListener("click", () => {
    const animal = animaisData.find((a) => a.id === currentAnimalId)

    if(animal){
        //Check se o usuário esta logado
        const userData = localStorage.getItem("userData") || sessionStorage.getItem("userData")

        if(!userData){
            alert("Você precisa estar logado para solicitar hospedagem. Redirecionando para o login...")
            window.location.href = "login.html"
            return
        }

        //In a real application, this would create a solicitacao_hospedagem in the database

        alert(
            `Solicitação enviada com sucesso!\n\nVocê solicitou hospedar ${animal.nome}.\n\nNossa equipe irá analisar sua solicitação e entrar em contato em breve.\n\nAcompanhe o status no seu Dashboard.`,
        )

        //close modal
        const modal = bootstrap.Modal.getIstance(document.getElementById("animalModal"))
        modal.hide()

        //Show success toast
        showToast("Solicitação enviada com sucesso! Acompanhe no Dashboard.","success")
    }
})

//Toast Function
function showToast(message, type = "info"){
    let toastContainer = document.getElementById("toastContainer")
    if(!toastContainer){
        toastContainer = document.createElement("div")
        toastContainer.id = "toastContainer"
        toastContainer.className = "position-fixed top-0 end-0 p-3"
        toastContainer.style.zIndex = "9999"
        document.body.appendChild(toastContainer)
    }

    const toastId = "toast-" + Date.now()
    const bgClass = type ==="success" ? "bg-success": type === "warning" ? "bg-warning" : type === "danger" ? "bg-danger" : "bg-info"

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} bordor-0" role="alert">
            <div class="toast-body">${message}</div>
            <button type="button" class=btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    
    `
    toastContainer.insertAdjacentHTML("beforeend", toastHTML)

    const toastElement = document.getElementById(toastId)
    const toast = new bootstrap.Toast(toastElement, {delay: 4000})
    toast.show()

    toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove()
    })
}

//Event Listeners
document.getElementById("btnFilter")?.addEventListener("click",filterAnimais)
document.getElementById("sortBy")?.addEventListener("change", sortAnimais)

//Carrega animais on page load
document.addEventListener("DOMContentLoaded", () =>{
    loadAnimais()

    //Check parametros URL
    const urlParams = new URLSearchParams(window.location.search)
    if(urlParams.has("tipo")){
        const tipo = urlParams.get("tipo")
        const tipoInput = document.getElementById("animalTypeFilter")
        if(tipoInput){
            tipoInput.value = tipo
            filterAnimais()
        }
    }
})

console.log("Animais.js carregado com sucesso")