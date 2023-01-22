const Associado = require("../models/Associado");
const Funcionario = require("../models/Funcionario");
const Usuario = require("../models/Usuario");
const Detalhes = require("../models/Detalhes_alteracao");
const sequelize = require("sequelize");
const Perfil = require("../models/Perfi");
const Area = require("../models/Areas_reserva");
const Reserva = require("../models/Reserva");
const path = require("path");

module.exports = class MenuController {
  static async renderizarMenuFuncionario(req, res) {
    const id = req.params.id;
    const usuario = await Usuario.findOne({
      raw: true,
      include: [{ model: Funcionario, required: true }],
      where: { id: id },
    });

    const perfil = await Perfil.findOne({
      raw: true,
      where: { id: usuario.PerfiId },
    });
    res.render("funcionario/menu-funcionario", { usuario, perfil });
  }

  static async renderizarMenuAssociado(req, res) {
    const id = req.params.id;
    const usuario = await Usuario.findOne({
      raw: true,
      include: { model: Associado, required: true },
      where: { id: id },
    });

    const perfil = await Perfil.findOne({
      raw: true,
      where: { id: usuario.PerfiId },
    });
    const associado = await Associado.findOne({
      raw: true,
      where: {
        UsuarioId: id,
      },
    });

    const status = associado.status === "Ativo" ? true : false;

    const associadoStatus = {
      status: status,
    };

    res.render("associado/menu-associado", {
      usuario,
      perfil,
      associadoStatus,
    });
  }

  static async visualizarConta(req, res) {
    const id = req.params.id;
    const usuario = await Usuario.findOne({
      attributes: {
        include: [
          "id",
          "nome_usuario",
          "cpf_usuario",
          "senha_usuario",
          "data_nascimento_usuario",
          "email_usuario",
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("data_nascimento_usuario"),
              "%d-%m-%Y"
            ),
            "data_nascimento_usuario",
          ],
        ],
      },
      raw: true,
      include: [{ model: Associado, required: true }],
      where: { id: id },
    });

    const associado = await Associado.findOne({
      attributes: {
        include: [
          "id",
          "genero_associado",
          "status",
          "createdAt",
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("createdAt"),
              "%d-%m-%Y %H:%i"
            ),
            "createdAt",
          ],
        ],
      },
      raw: true,
      where: { UsuarioId: id },
    });

    const status = associado.status === "Ativo" ? true : false;
    const associadoStatus = {
      status: status,
    };

    res.render("associado/visualizar-conta", {
      usuario,
      associado,
      associadoStatus,
    });
  }

  static async editarConta(req, res) {
    const id = req.params.id;

    const usuario = await Usuario.findOne({
      raw: true,
      where: { id: id },
      include: { model: Associado, require: true },
    });

    //verificando genero e dependentes pra if dentro do select no handlebars
    const associado = await Associado.findOne({
      raw: true,
      where: { UsuarioId: id },
    });
    const genero = associado.genero_associado === "Mulher" ? true : false;
    const dependentes = associado.dependentes === 1 ? true : false;
    const associadoStatus = associado.status === "Ativo" ? true : false;

    res.render("associado/usuario-edit", { usuario, genero, dependentes });
  }

  static async visualizarAssociados(req, res) {
    const idFunc = req.session.userId;

    Usuario.findAll({
      attributes: {
        include: [
          "id",
          "nome_usuario",
          "cpf_usuario",
          "senha_usuario",
          "data_nascimento_usuario",
          "email_usuario",
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("data_nascimento_usuario"),
              "%d-%m-%Y"
            ),
            "data_nascimento_usuario",
          ],
        ],
      },
      where: { PerfiId: 4 },
      raw: true,
      include: {
        model: Associado,
        required: true,
      },
    }).then((listaUsuarios) => {
      for (const usuario of listaUsuarios) {
        usuario.funcionario = idFunc;
      }

      res.render("funcionario/usuario-view", { listaUsuarios, idFunc });
    });
  }
  static async filtrarReservaBuscaAssociado(req, res) {
    const Op = sequelize.Op;
    const busca = await req.query.busca;
    const id = req.session.userId;
    const idUsuario = req.params.id;

    const usuarioAssociado = await Usuario.findOne({
      raw: true,
      where: {
        nome_usuario: { [Op.like]: `%${busca}%` },
      },
    });
    if (usuarioAssociado === null) {
      res.redirect(`/menu/funcionario/${idUsuario}/visualizar`);
    } else {
      const idFunc = req.session.userId;

      Usuario.findAll({
        attributes: {
          include: [
            "id",
            "nome_usuario",
            "cpf_usuario",
            "senha_usuario",
            "data_nascimento_usuario",
            "email_usuario",
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("data_nascimento_usuario"),
                "%d-%m-%Y"
              ),
              "data_nascimento_usuario",
            ],
          ],
        },
        where: { PerfiId: 4, nome_usuario: { [Op.like]: `%${busca}%` } },
        raw: true,
        include: {
          model: Associado,
          required: true,
        },
      }).then((listaUsuarios) => {
        for (const usuario of listaUsuarios) {
          usuario.funcionario = idFunc;
        }

        res.render("funcionario/usuario-view", { listaUsuarios, idFunc });
      });
    }
  }

  static async editarAssociado(req, res) {
    const idFuncionario = req.params.id;
    const idAssociado = req.params.idAssociado;

    res.redirect(`/usuarios/update/func=${idFuncionario}&user=${idAssociado}`);
  }

  static async aprovarAssociado(req, res) {
    const idUsuario = req.params.idUsuario;
    const idFuncionario = req.params.idFunc;

    const associado = await Associado.findOne({
      raw: true,
      where: { UsuarioId: idUsuario },
    });
    const funcionario = await Funcionario.findOne({
      raw: true,
      where: { UsuarioId: idFuncionario },
    });

    if (associado.status === "Desativado") {
      const novoStatus = await Associado.update(
        {
          status: "Ativo",
        },
        {
          where: { UsuarioId: idUsuario },
        }
      );
      const alteracao = await Detalhes.create({
        detalhes_alteracao: "Ativando cadastro",
        UsuarioId: idUsuario,
        FuncionarioId: funcionario.id,
      });
    } else {
      const novoStatus = await Associado.update(
        {
          status: "Desativado",
        },
        {
          where: { UsuarioId: idUsuario },
        }
      );

      const alteracao = await Detalhes.create({
        detalhes_alteracao: "Desativando cadastro",
        UsuarioId: idUsuario,
        FuncionarioId: funcionario.id,
      });
    }

    res.redirect(`/menu/funcionario/${idFuncionario}/visualizar`);
  }

  static async visualizarHistorico(req, res) {
    const idFunc = req.session.userId;
    const id = req.params.idUsuario;
    const idFuncionario = req.params.idFunc;

    const funcionario = {
      id: idFuncionario,
    };

    const usuario = await Usuario.findOne({raw: true, where: {id: id}});

    const listaAlteracoes = await Detalhes.findAll({
      attributes: {
        include: [
          "id",
          "detalhes_alteracao",
          "createdAt",
          "UsuarioId",
          "FuncionarioId",
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("createdAt"),
              "%d/%m/%Y %H:%I"
            ),
            "createdAt",
          ],
        ],
      },
      raw: true,
      where: { UsuarioId: id },
    });

    res.render("funcionario/historico", {
      listaAlteracoes,
      funcionario,
      idFunc,
      usuario
    });
  }

  static async visualizarReservasFuncionario(req, res) {
    const id = req.params.id;
    const associado = await Associado.findOne({
      raw: true,
      where: { UsuarioId: id },
    });

    if (await Funcionario.findOne({ where: { UsuarioId: id } })) {
      const funcionario = await Funcionario.findOne({
        raw: true,
        where: {
          UsuarioId: id,
        },
      });

      const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id,
        },
      });

      const listaReservas = await Reserva.findAll({
        raw: true,
        include: [{ model: Area, required: false }, Associado, Usuario],
      });

      for (const reserva of listaReservas) {
        reserva.funcionario = usuario.id;
      }

      const listaAreas = await Area.findAll({
        raw: true,
      });

      res.render("funcionario/reservas", {
        listaReservas,
        listaAreas,
        usuario,
      });
    } else {
      const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id,
        },
      });
      const associado = await Associado.findOne({
        raw: true,
        where: {
          UsuarioId: id,
        },
      });

      const listaReservas = await Reserva.findAll({
        raw: true,
        where: {
          AssociadoId: associado.id,
        },
        include: [
          {
            model: Area,
            required: false,
          },
        ],
      });

      const listaAreas = await Area.findAll({
        raw: true,
      });

      res.render("associado/reservas", {
        listaReservas,
        listaAreas,
        associado,
        usuario,
      });
    }
  }

  static async exportarHistorico(req, res) {
    const XLSX = require("xlsx");
    const id = req.params.id;

    const listaAlteracoes = await Detalhes.findAll({
      attributes: {
        include: [
          "id",
          "detalhes_alteracao",
          "createdAt",
          "UsuarioId",
          "FuncionarioId",
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("createdAt"),
              "%d/%m/%Y %H:%I"
            ),
            "createdAt",
          ],
        ],
      },
      raw: true,
      where: { UsuarioId: id },
    });

    const usuario = await Usuario.findOne({raw: true, where: {id:id}})
    let nomeUsuario = usuario.nome_usuario.replace(' ','_');
    
    const convertJsonToExcel = async () => {
      const workSheet = XLSX.utils.json_to_sheet(listaAlteracoes);
      const workBook = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(workBook, workSheet, "historico");
      // Generate buffer
      XLSX.write(workBook, { bookType: "csv", type: "buffer" });

      // Binary string
      XLSX.write(workBook, { bookType: "csv", type: "binary" });

      XLSX.writeFile(workBook, `public/files/historico_${nomeUsuario}.csv`);
    };

    await convertJsonToExcel();

    res.redirect(`/menu/funcionario/historico/func=${req.session.userId}&user=${id}`)
  }

  static async visualizarReservasAssociado(req, res) {
    const id = req.params.id;
    const associado = await Associado.findOne({
      raw: true,
      where: { UsuarioId: id },
    });

    if (await Funcionario.findOne({ where: { UsuarioId: id } })) {
      const funcionario = await Funcionario.findOne({
        raw: true,
        where: {
          UsuarioId: id,
        },
      });

      const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id,
        },
      });

      const listaReservas = await Reserva.findAll({
        raw: true,
        include: [{ model: Area, required: false }, Associado],
      });

      const listaAreas = await Area.findAll({
        raw: true,
      });

      res.render("funcionario/reservas", {
        listaReservas,
        listaAreas,
        usuario,
      });
    } else {
      const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id,
        },
      });
      const associado = await Associado.findOne({
        raw: true,
        where: {
          UsuarioId: id,
        },
      });

      const listaReservas = await Reserva.findAll({
        raw: true,
        where: {
          AssociadoId: associado.id,
        },
        include: [
          {
            model: Area,
            required: false,
          },
        ],
      });

      const listaAreas = await Area.findAll({
        raw: true,
      });

      res.render("associado/reservas", {
        listaReservas,
        listaAreas,
        associado,
        usuario,
      });
    }
  }
};
