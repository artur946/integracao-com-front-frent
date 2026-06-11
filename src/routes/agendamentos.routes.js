const express = require('express');
const router = express.Router();
const agendamentosController = require('../controllers/agendamentosController');

router.get('/', agendamentosController.listarAgendamentos);
router.post('/', agendamentosController.criarAgendamento);

module.exports = router;