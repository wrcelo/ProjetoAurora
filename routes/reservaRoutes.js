const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');
const checarFuncionario = require('../helpers/auth').checarFuncionario;
const checarAssociado = require('../helpers/auth').checarAssociado;
const checarSessao = require('../helpers/auth').checarSessao;

//Renderizar reserva
router.get('/', checarSessao, ReservaController.showReserva);

// save
router.post('/save/user=:id',  checarAssociado, ReservaController.criarReserva);

// filtrar do associado
router.get('/filtrar/associado/:id', checarAssociado, ReservaController.filtrarReservaAssociado);

// filtrar do funcionario
router.get('/filtrar/funcionario/:id', checarFuncionario, ReservaController.filtrarReservaFuncionario);

// filtrar campo de busca - Reservas
router.get('/buscar/funcionario/:id', checarFuncionario, ReservaController.filtrarReservaBuscaReservas)

// deletar reserva - usuario
router.get('/delete/:idRes/', checarAssociado, ReservaController.deletarReservaAssociado)


module.exports = router; 


