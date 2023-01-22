const express = require('express');
const router = express.Router();
const DependentesController = require('../controllers/DependentesController');
const Dependente = require('../models/Dependente');

//ROTAS DO ASSOCIADO
const checarFuncionario = require('../helpers/auth').checarFuncionario;
const checarAssociado = require('../helpers/auth').checarAssociado;
const checarSessao = require('../helpers/auth').checarSessao;

//Rota responsável por exibir os dependentes
router.get('/user=:id', checarAssociado, DependentesController.criarDependentes )
//Rota para salvar os dependentes
router.post('/save/user=:id', checarAssociado, DependentesController.salvarDependentes)
//Rota para editar os dependentes
router.get('/edit/:id', checarAssociado, DependentesController.editarDependentes);
//Rota para salvar a edição dos dependentes
router.post('/edit/save/user=:id&dep=:iddep', checarAssociado, DependentesController.salvarEdicaoDependentes);
//Rota para excluir dependentes
router.get('/delete/:id', checarAssociado, DependentesController.excluirDependentes);

//ROTAS DO FUNCIONÁRIO
//Rota para exibir os dependentes na view de funcionários
router.get('/funcionario/user=:id&func=:idFunc', DependentesController.visualizarDependentes)
//Rota para editar os dependentes na view de funcionários
router.get('/funcionario/edit/dep=:id', DependentesController.funcionarioEditarDependentes);
//Rota para salvar a edição dos dependentes na view de funcionários
router.post('/funcionario/edit/:id/save', DependentesController.funcionarioSalvarDependentes);
//Rota para excluir os dependentes na view de funcionários
router.get('/funcionario/delete/:id', DependentesController.funcionarioExcluirDependentes);

module.exports = router;