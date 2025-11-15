document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Search Form Handler
const searchForm = document.getElementById("searchForm")
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const animalType = document.getElementById("animalType")?.value || ""
    const porte = document.getElementById("porte")?.value || ""
    const idade = document.getElementById("idade")?.value || ""

    // Store search params and redirect
    const searchParams = new URLSearchParams({
      tipo: animalType,
      porte,
      idade,
    })

    window.location.href = `animais.html?${searchParams.toString()}`
  })
}

// Load Pet Gallery from Dog API
async function loadPetGallery() {
  const galleryContainer = document.getElementById("petGallery")
  if (!galleryContainer) return

  try {
    // Using Dog API (public API)
    const dogResponse = await fetch("https://dog.ceo/api/breeds/image/random/6")
    const dogData = await dogResponse.json()

    if (dogData.status === "success") {
      galleryContainer.innerHTML = ""

      dogData.message.forEach((imageUrl, index) => {
        const col = document.createElement("div")
        col.className = "col-md-4 col-lg-2 fade-in"
        col.style.animationDelay = `${index * 0.1}s`

        col.innerHTML = `
                    <div class="pet-gallery-card card border-0 shadow-sm">
                        <img src="${imageUrl}" class="card-img-top" alt="Pet feliz">
                        <div class="card-body p-2 text-center">
                            <small class="text-muted">Pet Feliz #${index + 1}</small>
                        </div>
                    </div>
                `

        galleryContainer.appendChild(col)
      })
    }
  } catch (error) {
    console.error("[v0] Error loading pet gallery:", error)
    galleryContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Não foi possível carregar as imagens no momento.</p>
            </div>
        `
  }
}

// Initialize gallery on page load
if (document.getElementById("petGallery")) {
  loadPetGallery()
}

// Toast Notification Function
function showToast(message, type = "info") {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toastContainer")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toastContainer"
    toastContainer.className = "position-fixed top-0 end-0 p-3"
    toastContainer.style.zIndex = "9999"
    document.body.appendChild(toastContainer)
  }

  // Create toast
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
  const toast = window.bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3000 })
  toast.show()

  // Remove from DOM after hidden
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove()
  })
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.classList.add("shadow")
  } else {
    navbar.classList.remove("shadow")
  }
})

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe all cards
document.querySelectorAll(".card, .feature-card, .service-card").forEach((card) => {
  observer.observe(card)
})

// FAQ Accordion Enhancement
document.querySelectorAll(".accordion-button").forEach((button) => {
  button.addEventListener("click", function () {
    const icon = this.querySelector("i")
    if (icon) {
      icon.classList.toggle("bi-chevron-down")
      icon.classList.toggle("bi-chevron-up")
    }
  })
})

console.log("PousaPet main.js Carregado com sucesso!")