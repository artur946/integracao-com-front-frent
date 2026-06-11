// Integracao do front-end de Servicos com a API usando fetch

const API_URL = '/api/servicos';

const lista = document.getElementById('lista-servicos');
const form = document.getElementById('form-servico');
const mensagem = document.getElementById('mensagem');

// Formata um valor numerico como moeda brasileira
function formatarPreco(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Busca os servicos na API e exibe na lista
async function carregarServicos() {
    lista.innerHTML = '<li>Carregando servicos...</li>';

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Falha ao buscar servicos');
        }

        const servicos = await resposta.json();

        if (!Array.isArray(servicos) || servicos.length === 0) {
            lista.innerHTML = '<li>Nenhum servico cadastrado.</li>';
            return;
        }

        lista.innerHTML = '';
        servicos.forEach((servico) => {
            const item = document.createElement('li');
            item.textContent = `${servico.nome} - ${formatarPreco(servico.preco)}`;
            lista.appendChild(item);
        });
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = '<li>Erro ao carregar servicos.</li>';
    }
}

// Envia um novo servico para a API
async function cadastrarServico(evento) {
    evento.preventDefault();
    mensagem.textContent = '';

    const nome = document.getElementById('nome').value.trim();
    const preco = document.getElementById('preco').value;

    if (!nome || preco === '') {
        mensagem.textContent = 'Preencha nome e preco.';
        return;
    }

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco: Number(preco) })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao cadastrar servico');
        }

        mensagem.textContent = 'Servico cadastrado com sucesso!';
        form.reset();
        carregarServicos();
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message;
    }
}

form.addEventListener('submit', cadastrarServico);

// Carrega a lista assim que a pagina abre
carregarServicos();
