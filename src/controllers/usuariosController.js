const pool = require('../database/conexao');
const bcrypt = require('bcrypt');

const listarUsuarios = async (req, res) => {
    try {
        const [usuarios] = await pool.query('SELECT id, nome, email FROM usuarios');
        res.json(usuarios);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
    }
};

const buscarPorEmailVulneravel = async (req, res) => {
    try {
        const { email } = req.query;
        const [usuarios] = await pool.query(
            `SELECT id, nome, email FROM usuarios WHERE email = '${email}'`
        );
        res.json(usuarios);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
};

const buscarPorEmailSeguro = async (req, res) => {
    try {
        const { email } = req.query;
        const [usuarios] = await pool.query(
            'SELECT id, nome, email FROM usuarios WHERE email = ?',
            [email]
        );
        res.json(usuarios);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
};

const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [usuarios] = await pool.query(
            'SELECT id, nome, email FROM usuarios WHERE id = ?',
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json(usuarios[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
};

const criarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        console.log('senhaHash:', senhaHash);
        
        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );


        res.status(201).json({
            mensagem: 'Usuário criado com sucesso',
            id: resultado.insertId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar usuário' });
    }
};

const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ mensagem: 'Nome e email são obrigatórios' });
        }

        const [resultado] = await pool.query(
            'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
            [nome, email, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
    }
};

const deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json({ mensagem: 'Usuário removido com sucesso' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao remover usuário' });
    }
};





module.exports = {
    listarUsuarios,
    buscarPorEmailVulneravel,
    buscarPorEmailSeguro,
    buscarPorId,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};