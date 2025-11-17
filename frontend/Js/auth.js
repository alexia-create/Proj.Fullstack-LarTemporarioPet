// CHANGE: Authentication pages - Fixed to redirect based on user type and properly handle responses
document.addEventListener('DOMContentLoaded', () => {
  console.log("[v0] Auth.js loaded - checking API availability:", typeof API);
  
  const loginForm = document.getElementById('loginForm');
  const cadastroForm = document.getElementById('cadastroForm');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const togglePasswordCadastroBtn = document.getElementById('togglePasswordCadastro');

  // Toggle password visibility - Login
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const passwordInput = document.getElementById('password');
      const icon = togglePasswordBtn.querySelector('i');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      }
    });
  }

  // Toggle password visibility - Cadastro
  if (togglePasswordCadastroBtn) {
    togglePasswordCadastroBtn.addEventListener('click', () => {
      const passwordInput = document.getElementById('passwordCadastro');
      const icon = togglePasswordCadastroBtn.querySelector('i');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      }
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (!email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
      }

      try {
        console.log("[v0] Attempting login with email:", email);
        const response = await API.login(email, password);
        console.log("[v0] Login response:", response);
        
        if (response.error) {
          alert('Erro: ' + response.error);
        } else if (response.token && response.usuario) {
          setToken(response.token);
          setUsuarioLogado(response.usuario);
          const tipoUsuario = response.usuario.tipo_usuario || 'solicitante';
          setTipoUsuario(tipoUsuario);
          
          console.log("[v0] Login successful. User type:", tipoUsuario);
          alert('Login realizado com sucesso!');
          
          if (tipoUsuario === 'voluntario') {
            window.location.href = 'dashboard.html';
          } else {
            window.location.href = 'dashboard-solicitante.html';
          }
        } else {
          alert('Resposta inválida do servidor');
        }
      } catch (error) {
        console.error('[v0] Erro no login:', error);
        alert('Erro ao fazer login: ' + error.message);
      }
    });
  }

  // Cadastro
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const tipoUsuario = document.querySelector('input[name="accountType"]:checked').value;
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('emailCadastro').value;
      const telefone = document.getElementById('telefone').value;
      const cidade = document.getElementById('cidade').value;
      const password = document.getElementById('passwordCadastro').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Validação
      if (!nome || !email || !telefone || !cidade || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos');
        return;
      }

      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }

      if (password.length < 8) {
        alert('A senha deve ter no mínimo 8 caracteres');
        return;
      }

      try {
        console.log("[v0] Attempting registration with email:", email);
        
        const userData = {
          nome_completo: nome,
          email: email,
          senha: password,
          telefone: telefone,
          cidade: cidade,
          estado: 'PB',
          tipo_usuario: tipoUsuario
        };

        console.log("[v0] Sending registration data:", userData);
        const response = await API.registrar(userData);
        console.log("[v0] Registration response:", response);
        
        if (response.error) {
          alert('Erro: ' + response.error);
        } else {
          alert('Cadastro realizado com sucesso! Faça login para continuar.');
          setTipoUsuario(tipoUsuario);
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1500);
        }
      } catch (error) {
        console.error('[v0] Erro no cadastro:', error);
        alert('Erro ao fazer cadastro: ' + error.message);
      }
    });
  }
});
