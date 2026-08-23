// ---------------------------------------------------------------------------
// GUARDA DE PÁGINA
// ---------------------------------------------------------------------------
const usuarioLogado = sessionStorage.getItem("usuarioLogado");
if (!usuarioLogado) {
    window.location.href = "login.html";
}

// ---------------------------------------------------------------------------
// ESTADO DO SISTEMA (Banco de dados temporário)
// ---------------------------------------------------------------------------
const cargas = [];
let proximoId = 1;

// ---------------------------------------------------------------------------
// REFERÊNCIAS DO HTML
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

// Exibe o usuário logado e configura o botão Sair
loggedUserLabel.textContent = usuarioLogado;
logoutButton.addEventListener('click', function () {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

// Filtro de busca na tabela
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
searchInput.addEventListener('input', aplicarFiltro);

// ---------------------------------------------------------------------------
// Lógica de mostrar/esconder campos de Precificação
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
// ENVIO DO FORMULÁRIO E VALIDAÇÃO
// ---------------------------------------------------------------------------
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Impede a página de piscar/recarregar
    errorMessage.style.display = "none";

    const numeroOS = document.getElementById('serviceOrderNumber').value;
    const nf = document.getElementById('invoiceNumber').value;
    const pagador = document.getElementById('payer').value;
    const descricao = document.getElementById('productDescription').value;
    const modal = document.getElementById('transportMode').value;
    const peso = parseFloat(document.getElementById('weight').value);
    const destino = document.getElementById('destination').value;
    const temCotacao = hasQuoteSelect.value === "sim";

    let precificacao;
    let refPreco;

    if (temCotacao) {
        precificacao = "Cotação";
        refPreco = quoteNumberInput.value;
    } else {
        precificacao = "Tabela";
        refPreco = priceTablePreview.value;
    }

    // --- REGRAS DE NEGÓCIO ---
    if (peso <= 0) {
        errorMessage.textContent = "Erro: O peso da carga deve ser maior que zero.";
        errorMessage.style.display = "block";
        return;
    }

    if (modal === 'Aéreo' && peso > 500) {
        errorMessage.textContent = "Bloqueio Operacional: cargas aéreas acima de 500kg exigem aprovação especial.";
        errorMessage.style.display = "block";
        return;
    }

    const nfDuplicada = cargas.some(
        (carga) => carga.numeroOS === numeroOS && carga.nf === nf
    );
    if (nfDuplicada) {
        errorMessage.textContent = `Erro: A NF ${nf} já foi lançada para a OS ${numeroOS}.`;
        errorMessage.style.display = "block";
        return;
    }

    // --- SUCESSO: Guarda a carga e atualiza a tabela ---
    const novaCarga = {
        id: proximoId++,
        numeroOS: numeroOS,
        nf: nf,
        cte: null, 
        pagador: pagador,
        descricao: descricao,
        modal: modal,
        peso: peso,
        destino: destino,
        precificacao: precificacao,
        refPreco: refPreco,
    };

    cargas.push(novaCarga);
    renderizarTabela();

    // Guarda a OS antes do reset para facilitar a digitação da próxima NF
    const osAtual = numeroOS;
    form.reset();
    document.getElementById('serviceOrderNumber').value = osAtual;
    
    quoteNumberGroup.style.display = "none";
    priceTableGroup.style.display = "none";
    document.getElementById('invoiceNumber').focus();
});

// ---------------------------------------------------------------------------
// CRIAÇÃO VISUAL DA TABELA
// ---------------------------------------------------------------------------
function renderizarTabela(lista = cargas) {
    tabelaCargas.innerHTML = "";

    lista.forEach((carga) => {
        const linha = document.createElement('tr');

        adicionarCelula(linha, carga.numeroOS);
        adicionarCelula(linha, carga.nf);

        // Lógica do botão Emitir CT-e
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

        // Status visual
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

// Simula a emissão gerando um número de CT-e
function emitirCte(id) {
    const carga = cargas.find((item) => item.id === id);
    if (!carga) return;

    carga.cte = `CTE-${String(id).padStart(4, "0")}`;
    aplicarFiltro(); 
}