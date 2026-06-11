const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController'); // Ajuste o caminho se necessário

router.get('/', usuariosController.listarUsuarios);
router.get('/busca-email-vulneravel', usuariosController.buscarPorEmailVulneravel);
router.get('/busca-email-seguro', usuariosController.buscarPorEmailSeguro);
router.get('/:id', usuariosController.buscarPorId);
router.post('/', usuariosController.criarUsuario);
router.put('/:id', usuariosController.atualizarUsuario);
router.delete('/:id', usuariosController.deletarUsuario);

module.exports = router;