const bootstrap = window.bootstrap

function setupPasswordToggle(toggleId, passwordId){
    const toggleButton = document.getElementById(toggleId)
    const passwordInput = document.getElementById(passwordId)

    if(toggleButton && passwordInput){
        toggleButton.addEventListener("click", function
            (){
                const type = passwordInput.type === "password" ? "text": "password"
                passwordInput.type = type

                const icon = this.querySelector("i")
                icon.classList.toggle("bi-eye")
                icon.classList.toggle("bi-eye-slash")
        })
    }
}

setupPasswordToggle("togglePassword", "password")
setupPasswordToggle("togglePasswordCadastro", "passwordCadastro")

const loginForm = document.getElementById("loginForm")
if(loginForm){
    loginForm.addEventListener("submit", function(e){
        e.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const rememberMe = document.getElementById("rememberMe").checked

        if(!validateEmail(email)){
            showAuthToast("Por favor, insira um email", "warning")
            return
        }

        if(password.length < 6){
            showAuthToast("A senha deve ter no mínimo 6 caracteres", "warning")
            return
        }

        const submitButton = this.querySelector('button[type="submit"]')
        const originalText = submitButton.innerHTML
        submitButton.disabled = true 
        submitButton.innerHTML = '<span class= "spinner-border spinner-border-sm me-2"></span>Entrando...'

        setTimeout(() =>{

            const userData = {
                email:email,
                loggedIn: true,
                timestamp: new Date().toISOString(),
            }
            if(rememberMe){
                localStorage.setItem("userData", JSON.stringify(userData))
            }else{
                sessionStorage.setItem("userData", JSON.stringify(userData))
            }
            showAuthToast("login relizado com sucesso!", "success")

            setTimeout(() =>{
                window.location.href ="dashboard.html"
            }, 1000)
        }, 1500)
    })
}

// Cadastro form handler
const cadastroForm = document.getElementById("cadastroForm")
if(cadastroForm){
    cadastroForm.addEventListener("submit", function(e){
        e.preventDefault()

        const nome = document.getElementById("nome").value
        const email = document.getElementById("emailCadastro").value
        const telefone = document.getElementById("telefone").value
        const cidade = document.getElementById("cidade").value
        const password = document.getElementById("passwordCadastro").value
        const confirmPassword = document.getElementById
        ("confirmPassword").value
        const accountType = document.querySelector('input[name="accountType"]:checked').value
        const termos = document.getElementById("termos").checked

        // Validação
        if(!validateEmail(email)){
            showAuthToast("Por favor, insira um e-mail válido", "warning")
            return
        }

        if(password.length < 8){
            showAuthToast("A senha deve ter no mínimo 8 caracteres", "warning")
            return 
        }

        if(password !== confirmPassword){
            showAuthToast("As senhas não coincidem", "danger")
            return
        }

        if(!termos){
            showAuthToast("Você deve aceitar os temos de uso", "warning")
            return
        }

        // Simulação da chamada API
        const submitButton = this.querySelector('button[type="submit"]')
        const originalText = submitButton.innerHTML
        submitButton.disabled = true
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Criando conta...'

        setTimeout(()=>{
            // Store user data
            const userData = {
                nome: nome,
                email: email,
                telefone: telefone,
                cidade: cidade,
                accountType: accountType,
                loggedIn: true,
                timestamp: new Date().toISOString(),
            }

            localStorage.setItem("userData", JSON.stringify(userData))

            showAuthToast("Conta criada com sucesso!", "success")

            // Redirecionamento para o dashboard
            setTimeout(() =>{
                window.location.href = "dashboard.html"
            },1000)
        },2000)
    })
}

// Forgot Password Form Handler
const forgotPasswordForm = document.getElementById("forgotPasswordForm")
if(forgotPasswordForm){
    forgotPasswordForm.addEventListener("submit", function(e){
        e.preventDefault()

        const email = document.getElementById("resetEmail").value

        if(!validateEmail(email)){
            showAuthToast("Por favor, insira um e-mail válido", "warning")
            return
        }

        const submitButton = this.querySelector('button[type="submit"]')
        const originalText = submitButton.innerHTML
        submitButton.disabled = true
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...'

        setTimeout(() => {
            showAuthToast("Instruções enviadas para seu e-mail", "success")
            submitButton.disabled = false
            submitButton.innerHTML = originalText

            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("forgotPasswordModal"))
            modal.hide()

            // resetar form
            forgotPasswordForm.requestFullscreen()
        }, 1500)
    })
}

// Validação do email
function validateEmail(email){
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

// notificação toast na pagina de Auth
function showAuthToast(message, type = "info"){
    let toastContainer = document.getElementById("toastContainer")
    if(!toastContainer){
        toastContainer = document.createElement("div")
        toastContainer.id = "toastContainer"
        toastContainer.className = "position-fixed top-0 end-0 p-3"
        toastContainer.style.zIndex = "9999"
        document.body.appendChild(toastContainer)
    }

    const toastId = "toast-" + Date.now()
    const bgClass = type ==="success" ? "bg-success" : type === "warning" ? "bg-warning" : type === "danger" ? "bg-danger" : "bg-info"

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
            <div class="d-flex">
                <div class = "d-flex">
                    <div class= "toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast"></button>
                </div>
            </div>
        `

    toastContainer.insertAdjacentHTML("beforeend", toastHTML)

    const toastElement = document.getElementById(toastId)
    const toast = new bootstrap.Toast(toastElement, {delay: 3000})
    toast.show()

    toastElement.addEventListener("hidden.bs.toast", () =>{
        toastElement.remove()
    })
}

// Phone Mask
const telefoneInput = document.getElementById("telefone")
if(telefoneInput){
    telefoneInput.addEventListener("input", (e) =>{
        let value = e.target.value.replace(/\D/g, "")

        if(value.length <= 11){
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
            value = value.replace(/(\d{4})$/, "$1-$2")
        }

        e.target.value = value
    })
}

console.log("Auth.js carregado com sucesso")