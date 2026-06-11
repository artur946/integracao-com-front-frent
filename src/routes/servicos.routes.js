const express = require('express');
const router = express.Router();
const servicosController = require('../controllers/servicosController');

router.get('/', servicosController.listarServicos);
router.post('/', servicosController.criarServico);

module.exports = router;