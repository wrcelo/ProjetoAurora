const Perfil = require("../models/Perfi");
const Usuario = require("../models/Usuario");
const Associado = require("../models/Associado");
const Funcionario = require("../models/Funcionario");
const Detalhe = require("../models/Detalhes_alteracao");
const bcrypt = require('bcryptjs');
const Reserva = require("../models/Reserva");

module.exports = class UsuarioController {
  static salvarAssociado(req, res) {
    
    const nome_usuario = req.body.nome;
    const cpf_usuario = req.body.cpf;
    const data_nascimento_usuario = req.body.dataNasc;
    const email_usuario = req.body.email;
    const senha_usuario = req.body.csenha;
    const genero_associado = req.body.genero;

    //Criptografar a senha
    const salt = bcrypt.genSaltSync(10);
    const senhaCriptografada = bcrypt.hashSync(senha_usuario, salt);

    Perfil.findAll({ where: { nome_perfil: "Associado" } }).then((perfil) => {
      Usuario.create({
        nome_usuario,
        cpf_usuario,
        senha_usuario: senhaCriptografada,
        data_nascimento_usuario,
        email_usuario,
        PerfiId: perfil[0].dataValues.id,
      }).then((usuario) => {
        Associado.create({
          genero_associado,
          UsuarioId: usuario.dataValues.id,
        }).then(() => res.redirect("/login"));
      });
    });
  }

  static async deletarAssociado(req, res) {
    const delete_id = req.params.idUsuario;
    const idFunc = req.params.idFunc;
    const usuario = await Usuario.findOne({raw: true, where: {id: delete_id}});
    const associado = await Associado.findOne({raw: true, where: {UsuarioId: usuario.id}});
    const funcionario = await Funcionario.findOne({raw: true, where: {UsuarioId: idFunc}});

    //deletando reserva primeiro por causa da FK
    await Reserva.destroy({ where: {AssociadoId: associado.id}});
    await Usuario.destroy({
        where: {
            id: delete_id
        }
    })
      //historico de qual usuario foi deletado
      await Detalhe.create({
        detalhes_alteracao: `Exclusão do usuário ${usuario.nome_usuario}, com id ${usuario.id}`,
      UsuarioId: null,
      FuncionarioId: funcionario.id
      })
    res.redirect(`/menu/funcionario/${idFunc}/visualizar`);
    }

  static cadastrarAssociado(req, res) {
    res.render('cadastro');
  }

  static async editarAssociado (req, res) {
    const idFuncionario = req.params.idFunc;
    const idAssociado = req.params.idUsuario;
    
    const usuario = await Usuario.findOne({
      raw: true,
      where: {id: idAssociado}, 
      include: {model: Associado,
      require: true}
  });
    
  //verificando genero e dependentes pra if dentro do select no handlebars
  const idFunc = req.session.userId;
    const associado = await Associado.findOne({
      raw: true,
      where: {UsuarioId: idAssociado}
    });
    const genero = associado.genero_associado === 'Mulher' ? true : false;

    const funcionario = await Usuario.findOne({
      raw: true, 
      where: {id: idFuncionario},include: {model: Funcionario,
        require: true}
    });

    res.render('funcionario/usuario-edit', { usuario, funcionario, genero, idFunc})
  }

  static async atualizarAssociado(req, res) {
    const idFuncionario = req.params.idFunc;
    const id = req.params.idUsuario;
    const nome_usuario = req.body.nome;
    const cpf_usuario = req.body.cpf;
    const data_nascimento_usuario = req.body.dataNasc;
    const email_usuario = req.body.email;
    const genero_associado = req.body.genero;
    

    await Usuario.update({
      nome_usuario,
      cpf_usuario,
      data_nascimento_usuario,
      email_usuario
    },{where: {id: id}});

    await Associado.update({
      genero_associado
    }, {where: {UsuarioId: id}});

    //precisa dar um create (insert) com idUsuario, idFuncionario,descricao e datatime atual na tabela de detalhes da alteração
    const funcionario = await Funcionario.findOne({raw: true, where: {UsuarioId: idFuncionario}});

    const descricao = req.body.textarea;
    await Detalhe.create({
      detalhes_alteracao: `${descricao}`,
      UsuarioId: id,
      FuncionarioId: funcionario.id
    });
    res.redirect(`/menu/funcionario/${idFuncionario}/visualizar`);
  }

  static async atualizarConta (req, res) {
    const id = req.params.idUsuario;
    const nome_usuario = req.body.nome;
    const cpf_usuario = req.body.cpf;
    const data_nascimento_usuario = req.body.dataNasc;
    const email_usuario = req.body.email;
    const genero_associado = req.body.genero;

    await Usuario.update({
      nome_usuario,
      cpf_usuario,
      data_nascimento_usuario,
      email_usuario
    },{where: {id: id}});

    await Associado.update({
      genero_associado
    }, {where: {UsuarioId: id}});

    //precisa dar um create (insert) com idUsuario, idFuncionario,descricao e datatime atual na tabela de detalhes da alteração

    await Detalhe.create({
      detalhes_alteracao: "Usuário alterou os dados da conta",
      UsuarioId: id
    });

    res.redirect(`/menu/associado/${id}/conta`);
  }
};
