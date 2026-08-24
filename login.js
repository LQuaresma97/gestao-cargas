const usuariosCadastrados = [
    { email: "operacional@empresa.com", senha: "1234" },
    { email: "conferencia@empresa.com", senha: "abcd" },
];

const form = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

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
