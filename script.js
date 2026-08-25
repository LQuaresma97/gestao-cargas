// ---------------------------------------------------------------------------
// GUARDA DE SESSÃO
// ---------------------------------------------------------------------------
const usuarioLogado = sessionStorage.getItem("usuarioLogado");
if (!usuarioLogado) {
    window.location.href = "index.html";
}

// ---------------------------------------------------------------------------
// ESTADO DO SISTEMA
// ---------------------------------------------------------------------------
const cargas = [];
let proximoId = 1;

// ---------------------------------------------------------------------------
// REFERÊNCIAS DO DOM
// ---------------------------------------------------------------------------
const form = document.getElementById('cargaForm');
const tabelaCargas = document.getElementById('tabelaCargas');
const errorMessage = document.getElementById('errorMessage');

const hasQuoteSelect = document.getElementById('hasQuote');
const quoteNumberGroup = document.getElementById('quoteNumberGroup');
const quoteNumberInput = document.getElementById('quoteNumber');
const priceTableGroup = document.getElementById('priceTableGroup');
const priceTablePreview = document.getElementById('priceTablePreview');

const searchInput = document.getElementById('searchInput');
const loggedUserLabel = document.getElementById('loggedUserLabel');
const logoutButton = document.getElementById('logoutButton');

loggedUserLabel.textContent = usuarioLogado;
logoutButton.addEventListener('click', function () {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
});

// ---------------------------------------------------------------------------
// FILTRO DE BUSCA (OS / NF)
// ---------------------------------------------------------------------------
const searchButton = document.getElementById('searchButton');

function aplicarFiltro() {
    const termo = searchInput.value.toLowerCase();
    const cargasFiltradas = cargas.filter((carga) => {
        return (
            carga.numeroOS.toLowerCase().includes(termo) ||
            carga.nf.toLowerCase().includes(termo)
        );
    });
    renderizarTabela(cargasFiltradas);
}

// Ativa a busca ao clicar na lupa
searchButton.addEventListener('click', aplicarFiltro);

// Ativa a busca ao apertar a tecla "Enter" dentro do campo de texto
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        aplicarFiltro();
    }
});

// Volta a mostrar todas as cargas automaticamente se o operador apagar o texto
searchInput.addEventListener('input', function () {
    if (this.value === '') {
        renderizarTabela(cargas);
    }
});

// ---------------------------------------------------------------------------
// CONTROLE DE INTERFACE: PRECIFICAÇÃO
// ---------------------------------------------------------------------------
hasQuoteSelect.addEventListener('change', function () {
    const temCotacao = this.value === "sim";

    quoteNumberGroup.style.display = temCotacao ? "flex" : "none";
    quoteNumberInput.required = temCotacao;

    priceTableGroup.style.display = temCotacao ? "none" : "flex";
    
    if (!temCotacao) {
        priceTablePreview.value = "Tabela do Pagador (Auto)";
    }
});

// ---------------------------------------------------------------------------
// VALIDAÇÃO E CADASTRO DE CARGA
// ---------------------------------------------------------------------------
form.addEventListener('submit', function (event) {
    event.preventDefault(); 
    errorMessage.style.display = "none";

    const numeroOS = document.getElementById('serviceOrderNumber').value;
    const nf = document.getElementById('invoiceNumber').value;
    const pagador = document.getElementById('payer').value;
    const descricao = document.getElementById('productDescription').value;
    const modal = document.getElementById('transportMode').value;
    const peso = parseFloat(document.getElementById('weight').value);
    const destino = document.getElementById('destination').value;
    const temCotacao = hasQuoteSelect.value === "sim";

    let precificacao = temCotacao ? "Cotação" : "Tabela";
    let refPreco = temCotacao ? quoteNumberInput.value : priceTablePreview.value;

    // Regras de Negócio
    if (peso <= 0) {
        exibirErro("Erro: O peso da carga deve ser maior que zero.");
        return;
    }

    if (modal === 'Aéreo' && peso > 500) {
        exibirErro("Bloqueio Operacional: cargas aéreas acima de 500kg exigem aprovação especial.");
        return;
    }

    const nfDuplicada = cargas.some(
        (carga) => carga.numeroOS === numeroOS && carga.nf === nf
    );
    
    if (nfDuplicada) {
        exibirErro(`Erro: A NF ${nf} já foi lançada para a OS ${numeroOS}.`);
        return;
    }

    const novaCarga = {
        id: proximoId++,
        numeroOS,
        nf,
        cte: null, 
        pagador,
        descricao,
        modal,
        peso,
        destino,
        precificacao,
        refPreco
    };

    cargas.push(novaCarga);
    renderizarTabela();

    const osAtual = numeroOS;
    form.reset();
    document.getElementById('serviceOrderNumber').value = osAtual;
    
    quoteNumberGroup.style.display = "none";
    priceTableGroup.style.display = "none";
    document.getElementById('invoiceNumber').focus();
});

function exibirErro(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.style.display = "block";
}

// ---------------------------------------------------------------------------
// RENDERIZAÇÃO DA TABELA
// ---------------------------------------------------------------------------
function renderizarTabela(lista = cargas) {
    tabelaCargas.innerHTML = "";

    lista.forEach((carga) => {
        const linha = document.createElement('tr');

        adicionarCelula(linha, carga.numeroOS);
        adicionarCelula(linha, carga.nf);

        const celulaCte = document.createElement('td');
        if (carga.cte) {
            celulaCte.textContent = carga.cte;
        } else {
            const botaoEmitir = document.createElement('button');
            botaoEmitir.type = "button";
            botaoEmitir.className = "btn-mini";
            botaoEmitir.textContent = "Emitir CT-e";
            botaoEmitir.addEventListener('click', () => emitirCte(carga.id));
            celulaCte.appendChild(botaoEmitir);
        }
        linha.appendChild(celulaCte);

        adicionarCelula(linha, `${carga.descricao} — ${carga.peso}kg - ${carga.modal} - ${carga.destino}`);
        adicionarCelula(linha, carga.pagador);
        adicionarCelula(linha, carga.precificacao);
        adicionarCelula(linha, carga.refPreco);

        const statusCelula = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.className = "status-ok";
        statusSpan.textContent = "Liberado";
        statusCelula.appendChild(statusSpan);
        linha.appendChild(statusCelula);

        tabelaCargas.appendChild(linha);
    });
}

function adicionarCelula(linha, texto) {
    const celula = document.createElement('td');
    celula.textContent = texto;
    linha.appendChild(celula);
}

function emitirCte(id) {
    const carga = cargas.find((item) => item.id === id);
    if (!carga) return;

    carga.cte = `CTE-${String(id).padStart(4, "0")}`;
    aplicarFiltro(); 
}
