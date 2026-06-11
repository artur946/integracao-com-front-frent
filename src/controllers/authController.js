const pool = require('../database/conexao');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    console.log('Iniciando processo de login...'); // Log para indicar o início do processo
    try {
        // 1. Receber email e senha pelo req.body
        const { email, password } = req.body;
        console.log('Dados recebidos para login:', { email, password }); // Log para verificar os dados recebidos

        // 2. Validar se os dois campos foram enviados
        if (!email || !password) {
            return res.status(400).json({
                message: "Por favor, preencha todos os campos obrigatórios."
            });
        }

        // 3. Buscar usuário pelo email no banco de dados.
        //    Usamos TRIM + LOWER para ignorar espaços e diferenca de maiusculas/minusculas.
        const emailNormalizado = email.trim().toLowerCase();
        const querySelect = 'SELECT * FROM usuarios WHERE LOWER(TRIM(email)) = ?';
        const [linhas] = await pool.query(querySelect, [emailNormalizado]);
        const usuario = linhas[0]; // Define a variável 'usuario' com o primeiro resultado encontrado

        console.log('Usuário encontrado:', usuario); // Log para verificar o conteúdo de 'usuario'

        // 4. Se não encontrar, retornar erro genérico
        if (!usuario) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        // 5. Comparar a senha digitada com a senha salva.
        //    Suporta tanto senhas em texto puro quanto hashes bcrypt.
        const senhaSalva = usuario.senha || '';
        const ehHashBcrypt = /^\$2[aby]\$/.test(senhaSalva); // Detecta se a senha salva é um hash bcrypt

        let senhaCorreta;
        if (ehHashBcrypt) {
            // Senha salva como hash -> comparar com bcrypt
            senhaCorreta = await bcrypt.compare(password, senhaSalva);
        } else {
            // Senha salva em texto puro -> comparação direta
            senhaCorreta = password === senhaSalva;
        }

        console.log('Resultado da comparação de senha:', senhaCorreta); // Log para verificar o resultado da comparação de senha

        // 6. Se a senha estiver incorreta, retornar erro genérico
        if (!senhaCorreta) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        // 7. Se estiver correta, retornar mensagem de login realizado com os dados do usuário
        return res.status(200).json({
            message: "Login realizado com sucesso!",
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error("Erro no processo de login:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};

module.exports = {
    login
};