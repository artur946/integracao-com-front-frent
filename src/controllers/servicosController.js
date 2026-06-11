const pool = require('../database/conexao');

// Lista todos os servicos cadastrados
const listarServicos = async (req, res) => {
    try {
        const [servicos] = await pool.query(
            'SELECT id, nome, preco FROM servicos ORDER BY id DESC'
        );
        res.json(servicos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar servicos' });
    }
};

// Cria um novo servico
const criarServico = async (req, res) => {
    try {
        const { nome, preco } = req.body;

        if (!nome || preco === undefined || preco === null || preco === '') {
            return res.status(400).json({ mensagem: 'Nome e preco sao obrigatorios' });
        }

        const [resultado] = await pool.query(
            'INSERT INTO servicos (nome, preco) VALUES (?, ?)',
            [nome, preco]
        );

        res.status(201).json({
            mensagem: 'Servico criado com sucesso',
            id: resultado.insertId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar servico' });
    }
};

module.exports = {
    listarServicos,
    criarServico
};
