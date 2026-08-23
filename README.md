# 📦 Sistema de Gestão de Cargas e Validação Logística

> **Projeto prático desenvolvido para automatizar e validar o fluxo de informações logísticas antes da emissão de documentos fiscais (CT-e / Minutas).**

---

## 🎯 Objetivo do Projeto

Na operação logística real, erros de digitação de pagador, divergência de cotações e emissões duplicadas geram muito retrabalho. O objetivo desta aplicação é atuar como uma "barreira de proteção" inteligente na etapa de conferência e emissão. 

O sistema centraliza o cadastro de cargas, aplica regras de negócio automáticas para validação de dados e disponibiliza um painel simples e interativo para o operador logístico gerar os documentos com segurança.

### ⚙️ Principais Funcionalidades Implementadas
- **Autenticação Simulada:** Tela de login para restringir o acesso à operação.
- **Validação de Regras Operacionais (Bloqueios):** 
  - Restrição automática para cargas do modal **Aéreo** acima de 500kg.
  - Bloqueio de peso zerado ou negativo.
- **Controle de Duplicidade:** O sistema impede o lançamento de uma mesma Nota Fiscal (NF) vinculada a uma mesma Ordem de Serviço (OS) já existente.
- **Lógica de Precificação Dinâmica:** O sistema adapta os campos do formulário exigindo o número da **Cotação** apenas se sinalizado, ou assumindo a **Tabela Padrão** do pagador automaticamente.
- **Renderização Dinâmica (Tabela):** Atualização em tempo real das cargas liberadas e sistema de busca reativa por OS ou NF.

---

## 🛠️ Tecnologias Utilizadas (Stack)

O projeto foi construído focado no aprimoramento dos fundamentos web:

- **[HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML):** Estruturação semântica das páginas e formulários (`login.html` e `logistica.html`).
- **[CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS):** Estilização completa no modo noturno (Dark Mode), focado em usabilidade e redução de cansaço visual para o operador.
- **[JavaScript (ES6+)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript):** Manipulação da interface (DOM), validação de regras de negócio e gerenciamento de estado (Array Methods, SessionStorage).

---

## 💡 Aprendizados e Consolidação de Conhecimentos

Durante a estruturação deste projeto, apliquei conceitos vitais da programação para resolver problemas reais de uma transportadora:

- **Manipulação Avançada de Arrays:** Uso de métodos como `.filter()`, `.find()`, `.some()` e `.forEach()` para buscar cargas, evitar duplicidades e gerar o CT-e específico de um ID.
- **State e SessionStorage:** Persistência do usuário logado na sessão do navegador, simulando um ambiente restrito.
- **Event Listeners e Interatividade:** Formulários que mudam de comportamento dependendo da seleção do usuário (ex: exibir campos de Cotação) sem recarregar a página.
- **Separação de Responsabilidades:** Organização limpa entre estrutura visual (HTML/CSS) e motor lógico (JavaScript).

---

## 🚀 Como Executar o Projeto

1. Clone o repositório em sua máquina:
   ```bash
   git clone [https://github.com/LQuaresma97/sistema-gestao-cargas.git](https://github.com/LQuaresma97/sistema-gestao-cargas.git)
