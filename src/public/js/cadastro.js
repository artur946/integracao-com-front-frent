// Integracao do formulario de cadastro com a API usando fetch

const API_CADASTRO_URL = '/api/usuarios';

const formCadastro = document.getElementById('form-cadastro');
const mensagemCadastro = document.getElementById('mensagem-cadastro');

async function cadastrarUsuario(evento) {
    evento.preventDefault();
    mensagemCadastro.textContent = '';

    const nome = document.getElementById('nome-cadastro').value.trim();
    const email = document.getElementById('email-cadastro').value.trim();
    const senha = document.getElementById('senha-cadastro').value;

    if (!nome || !email || !senha) {
        mensagemCadastro.textContent = 'Preencha nome, e-mail e senha.';
        return;
    }

    try {
        const resposta = await fetch(API_CADASTRO_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao criar conta');
        }

        mensagemCadastro.textContent = 'Conta criada com sucesso! Agora faca login.';
        formCadastro.reset();
    } catch (erro) {
        console.error(erro);
        mensagemCadastro.textContent = erro.message;
    }
}

formCadastro.addEventListener('submit', cadastrarUsuario);
