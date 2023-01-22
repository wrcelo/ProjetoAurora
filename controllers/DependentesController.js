const Associado = require('../models/Associado');
const Dependente = require('../models/Dependente');
const Usuario = require('../models/Usuario');
const Funcionario = require('../models/Funcionario');
const Detalhe = require('../models/Detalhes_alteracao');

module.exports = class DependentesController {
   
    static async criarDependentes(req,res){
        const id          = req.params.id
        const associado   = await Associado.findOne({raw: true, where: {UsuarioId: id}})
        const usuario     = await Usuario.findOne({raw: true, where: {id :id}});
        const dependentes = await Dependente.findAll({raw: true, where: {AssociadoId: associado.id}});

        const associadoStatus = associado.status === 'Ativo' ? true : false;
        res.render('dependentes/dependentes', {dependentes, associado, usuario, associadoStatus});
    }

    static async salvarDependentes(req,res){
        const nome_dependente             = req.body.nome;
        const cpf_dependente              = req.body.cpf;
        const data_nascimento_dependente  = req.body.data_nascimento;
        const tipo_dependente             = req.body.tipo;
        const id                          = req.params.id;
        console.log(id);

        const associado = await Associado.findOne({raw: true, where: {UsuarioId: id}})
        const dependenteAll = await Dependente.findAll({raw: true, where: {AssociadoId: associado.id}})
        const AssociadoId = associado.id 
        const usuario     = await Usuario.findOne({raw: true, where: {id :id}});

        //for para verificar se já foi cadastrado um dependente com o tipo: Conjuge
        let verificacao = 0;
        dependenteAll.forEach(function(i, index){
            if(dependenteAll[index].tipo_dependente === "Conjuge" && tipo_dependente === "Conjuge"){
                req.flash('message', 'Conjuge já cadastrado');
                req.session.save(()=>{
                    res.redirect(`/dependentes/user=${id}`);
                })      
            }else{
                verificacao += 1;
            }
        });
        
        if(verificacao == dependenteAll.length){
        const dependentes = {nome_dependente, cpf_dependente, data_nascimento_dependente, tipo_dependente, AssociadoId}
        await Dependente.create(dependentes);

        await Detalhe.create({
            detalhes_alteracao: "Usuário adicionou dependente",
            UsuarioId: usuario.id
          });

        res.redirect(`/dependentes/user=${id}`);
        }
    }

    static async editarDependentes(req,res){
        const id   = req.params.id;

        const dependentes = await Dependente.findOne({raw: true, where: {id: id}});
        const associado   = await Associado.findOne({raw: true, where: {id: dependentes.AssociadoId}});
        const usuario     = await Usuario.findOne({raw: true, where: {id: associado.UsuarioId}});


        res.render('dependentes/dependente-edit', {dependentes, usuario});
    }

    static async salvarEdicaoDependentes(req,res){
        const id                         = req.body.id;
        const nome_dependente            = req.body.nome;
        const cpf_dependente             = req.body.cpf;
        const data_nascimento_dependente = req.body.data_nascimento;
        const tipo_dependente            = req.body.tipo;
        const idUsuario                  = req.params.id;
        
        const dependenteAlterado = {id: id, nome_dependente, cpf_dependente, data_nascimento_dependente, tipo_dependente}

        await Dependente.update(dependenteAlterado, {where:{id: id}}) 

                       
        res.redirect(`/dependentes/user=${idUsuario}`);
    }

    static async excluirDependentes(req,res){
        const id = req.params.id;
        const dependentes = await Dependente.findOne({raw: true, where: {id: id}});
        const associado   = await Associado.findOne({raw: true, where: {id: dependentes.AssociadoId}});
        const usuario     = await Usuario.findOne({raw: true, where: {id: associado.UsuarioId}});
        
        await Dependente.destroy({where: {id: id}});

        await Detalhe.create({
            detalhes_alteracao: "Usuário excluiu dependente",
            UsuarioId: usuario.id
          }); 
    
        res.redirect(`/dependentes/user=${usuario.id}`);
    }
    
    static async visualizarDependentes(req,res){
        const id = req.params.id;
        const idFunc = req.session.userId;
        
        const associado   = await Associado.findOne({raw: true, where: {UsuarioId: id}})
        const usuario     = await Usuario.findOne({raw: true, where: {id :id}});
        const dependentes = await Dependente.findAll({raw: true, where: {AssociadoId: associado.id}});
        
        res.render(`funcionario/usuario-dependentes`, {associado, dependentes, idFunc, usuario})
    }

    static async funcionarioEditarDependentes(req,res){
        //pegando o id do dependente
        const id = req.params.id;
        console.log(id);
        const idFunc = req.session.userId

        const dependentes = await Dependente.findOne({raw: true, where: {id: id}});
        const associado   = await Associado.findOne({raw: true, where: {id: dependentes.AssociadoId}});
        const usuario     = await Usuario.findOne({raw: true, where: {id: associado.UsuarioId}});

        res.render('funcionario/usuario-dependente-edit', {dependentes, usuario, idFunc})
    }

    static async funcionarioSalvarDependentes(req,res){
        const id                          = req.params.id
        const idDependente                = req.body.idDependente;
        const nome_dependente             = req.body.nome;
        const cpf_dependente              = req.body.cpf;
        const data_nascimento_dependente  = req.body.data_nascimento;
        const tipo_dependente             = req.body.tipo;
        const idFunc                      = req.session.userId

        const associado   = await Associado.findOne({raw: true, where: {UsuarioId: id}});
        const dependente = await Dependente.findOne({raw: true, where: {id: idDependente}});

        await Dependente.update({nome_dependente, cpf_dependente, data_nascimento_dependente, tipo_dependente, AssociadoId: associado.id},{where: {id: dependente.id}})

        await Detalhe.create({
            detalhes_alteracao: req.body.textarea,
            UsuarioId: id,
            FuncionarioId: idFunc
        })

        res.redirect(`/dependentes/funcionario/user=${id}&func=${idFunc}`)
    }

    static async funcionarioExcluirDependentes(req,res){
        const id = req.params.id;
        const dependentes = await Dependente.findOne({raw: true, where: {id: id}});
        const associado   = await Associado.findOne({raw: true, where: {id: dependentes.AssociadoId}});
        const usuario     = await Usuario.findOne({raw: true, where: {id: associado.UsuarioId}});
        const idFunc      = req.session.userId

        await Dependente.destroy({where: {id: id}});

        await Detalhe.create({
            detalhes_alteracao: `Exclusão do dependente: ${dependentes.nome_dependente}`,
            UsuarioId: usuario.id,
            FuncionarioId: idFunc
        })
    
        res.redirect(`/dependentes/funcionario/user=${usuario.id}&func=${idFunc}`);
    }
}