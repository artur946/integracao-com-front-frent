const pool = require('../database/conexao');

const listarAgendamentos = async (req, res) => {
    try {
        const [agendamentos] = await pool.query(`
            SELECT
                agendamentos.id,
                usuarios.nome       AS usuario,
                servicos.nome       AS servico,
                servicos.preco,
                agendamentos.data_agendamento
            FROM agendamentos
            INNER JOIN usuarios ON agendamentos.usuario_id = usuarios.id
            INNER JOIN servicos ON agendamentos.servico_id = servicos.id
        `);

        res.json(agendamentos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar agendamentos' });
    }
};

const criarAgendamento = async (req, res) => {
    try {
        const { usuario_id, servico_id, profissional_id, data_agendamento } = req.body;

        const [usuarios] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
        if (usuarios.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        const [servicos] = await pool.query('SELECT id FROM servicos WHERE id = ?', [servico_id]);
        if (servicos.length === 0) {
            return res.status(404).json({ mensagem: 'Serviço não encontrado' });
        }

        const [resultado] = await pool.query(
            `INSERT INTO agendamentos (usuario_id, servico_id, profissional_id, data_agendamento)
             VALUES (?, ?, ?, ?)`,
            [usuario_id, servico_id, profissional_id, data_agendamento]
        );

        res.status(201).json({
            mensagem: 'Agendamento criado com sucesso',
            id: resultado.insertId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar agendamento' });
    }
};

module.exports = {
    listarAgendamentos,
    criarAgendamento
};