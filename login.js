const usuariosCadastrados = [
    { email: "operacional@empresa.com", senha: "1234" },
    { email: "conferencia@empresa.com", senha: "abcd" },
];

const form = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// --- INÍCIO DA FUNÇÃO DO BOTÃO ENTRAR ---
form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorMessage.style.display = "none";

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const usuarioEncontrado = usuariosCadastrados.find(
        (usuario) => usuario.email === email
    );

    if (!usuarioEncontrado) {
        errorMessage.textContent = "E-mail não encontrado.";
        errorMessage.style.display = "block";
        return;
    }

    if (usuarioEncontrado.senha !== senha) {
        errorMessage.textContent = "Senha incorreta.";
        errorMessage.style.display = "block";
        return;
    }

    sessionStorage.setItem("usuarioLogado", email);
    window.location.href = "logistica.html";
});
// --- FIM DA FUNÇÃO DO BOTÃO ENTRAR ---


// --- INÍCIO DA FUNÇÃO DO OLHO DA SENHA ---
const togglePassword = document.getElementById('togglePassword');
const senhaInput = document.getElementById('senha');

if (togglePassword && senhaInput) {
    togglePassword.addEventListener('click', function () {
        // Verifica qual é o tipo atual do campo e inverte
        const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
        senhaInput.setAttribute('type', type);
        
        // Troca o ícone do SVG (Olho aberto x Olho cortado)
        if (type === 'text') {
            this.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>`;
        } else {
            this.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>`;
        }
    });
}
