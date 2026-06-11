// Integracao do front-end de Agendamentos com a API usando fetch

const API_AGENDAMENTOS = '/api/agendamentos';
const API_USUARIOS = '/api/usuarios';
const API_SERVICOS = '/api/servicos';

const lista = document.getElementById('lista-agendamentos');
const form = document.getElementById('form-agendamento');
const mensagem = document.getElementById('mensagem');
const selectUsuario = document.getElementById('usuario_id');
const selectServico = document.getElementById('servico_id');

function formatarPreco(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(valor) {
    if (!valor) return '';
    const data = new Date(valor);
    if (isNaN(data)) return valor;
    return data.toLocaleString('pt-BR');
}

// Preenche um <select> com itens vindos da API
function preencherSelect(select, itens, textoVazio) {
    if (!Array.isArray(itens) || itens.length === 0) {
        select.innerHTML = `<option value="">${textoVazio}</option>`;
        return;
    }
    select.innerHTML = '<option value="">Selecione...</option>';
    itens.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nome;
        select.appendChild(option);
    });
}

// Carrega usuarios e servicos para os selects do formulario
async function carregarOpcoes() {
    try {
        const [respUsuarios, respServicos] = await Promise.all([
            fetch(API_USUARIOS),
            fetch(API_SERVICOS)
        ]);

        const usuarios = respUsuarios.ok ? await respUsuarios.json() : [];
        const servicos = respServicos.ok ? await respServicos.json() : [];

        preencherSelect(selectUsuario, usuarios, 'Nenhum usuario');
        preencherSelect(selectServico, servicos, 'Nenhum servico');
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = 'Erro ao carregar usuarios e servicos.';
    }
}

// Busca os agendamentos na API e exibe na lista
async function carregarAgendamentos() {
    lista.innerHTML = '<li>Carregando agendamentos...</li>';

    try {
        const resposta = await fetch(API_AGENDAMENTOS);

        if (!resposta.ok) {
            throw new Error('Falha ao buscar agendamentos');
        }

        const agendamentos = await resposta.json();

        if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
            lista.innerHTML = '<li>Nenhum agendamento cadastrado.</li>';
            return;
        }

        lista.innerHTML = '';
        agendamentos.forEach((ag) => {
            const item = document.createElement('li');
            item.textContent =
                `${ag.usuario} - ${ag.servico} (${formatarPreco(ag.preco)}) em ${formatarData(ag.data_agendamento)}`;
            lista.appendChild(item);
        });
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = '<li>Erro ao carregar agendamentos.</li>';
    }
}

// Envia um novo agendamento para a API
async function criarAgendamento(evento) {
    evento.preventDefault();
    mensagem.textContent = '';

    const usuario_id = selectUsuario.value;
    const servico_id = selectServico.value;
    const profissional_id = document.getElementById('profissional_id').value;
    const data_agendamento = document.getElementById('data_agendamento').value;

    if (!usuario_id || !servico_id || !data_agendamento) {
        mensagem.textContent = 'Selecione usuario, servico e informe a data.';
        return;
    }

    try {
        const resposta = await fetch(API_AGENDAMENTOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: Number(usuario_id),
                servico_id: Number(servico_id),
                profissional_id: profissional_id ? Number(profissional_id) : null,
                data_agendamento
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao criar agendamento');
        }

        mensagem.textContent = 'Agendamento criado com sucesso!';
        form.reset();
        carregarAgendamentos();
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message;
    }
}

form.addEventListener('submit', criarAgendamento);

// Inicializa a tela
carregarOpcoes();
carregarAgendamentos();
