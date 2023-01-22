const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/UsuarioController');
const checarFuncionario = require('../helpers/auth').checarFuncionario;
const checarAssociado = require('../helpers/auth').checarAssociado;

router.get('/', UsuarioController.cadastrarAssociado);

router.post('/save', UsuarioController.salvarAssociado);

router.get('/delete/func=:idFunc&user=:idUsuario', checarFuncionario, UsuarioController.deletarAssociado);

router.get('/update/func=:idFunc&user=:idUsuario', checarFuncionario, UsuarioController.editarAssociado);
router.post('/update/save/func=:idFunc&user=:idUsuario', checarFuncionario, UsuarioController.atualizarAssociado);
router.post('/update/save/user=:idUsuario', checarAssociado, UsuarioController.atualizarConta);

module.exports = router;