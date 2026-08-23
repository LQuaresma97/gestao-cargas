// ---------------------------------------------------------------------------
// Usuários "cadastrados". Isso é só pra praticar a lógica — senha em texto
// puro dentro do JS do navegador NUNCA deve existir num sistema real.
// Qualquer um abre o DevTools e lê isso aqui. Login de verdade valida a
// senha no servidor (isso é assunto pra quando você chegar em Node.js).
// ---------------------------------------------------------------------------
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

    // find() percorre o array e devolve o PRIMEIRO objeto que bater com a
    // condição — nesse caso, o usuário com esse e-mail. Se não achar
    // nenhum, find() devolve "undefined".
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

    // Login válido — guarda quem logou (sessionStorage sobrevive à troca de
    // página, diferente de uma variável comum) e segue pro sistema de cargas.
    sessionStorage.setItem("usuarioLogado", email);
    window.location.href = "logistica.html";
});
