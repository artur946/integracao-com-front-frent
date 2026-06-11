// Integracao do formulario de login com a API usando fetch

const API_URL = '/api/auth/login';

const form = document.getElementById('form-login');
const mensagem = document.getElementById('mensagem');

async function fazerLogin(evento) {
    evento.preventDefault();
    mensagem.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        mensagem.textContent = 'Preencha e-mail e senha.';
        return;
    }

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.message || 'Erro ao fazer login');
        }

        mensagem.textContent = dados.message || 'Login realizado com sucesso!';

        // Guarda o usuario logado para uso nas outras telas
        if (dados.user) {
            localStorage.setItem('usuario', JSON.stringify(dados.user));
        }
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message;
    }
}

form.addEventListener('submit', fazerLogin);
