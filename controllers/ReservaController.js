const Reserva = require("../models/Reserva");
const Area = require("../models/Areas_reserva");
const Funcionario = require("../models/Funcionario");
const Usuario = require("../models/Usuario");
const Associado = require("../models/Associado");
const Sequelize = require("sequelize")
const Detalhe = require("../models/Detalhes_alteracao")

module.exports = class ReservaController {


  static async criarReserva(req, res) {
    const idUsuario = req.params.id;
    const associado = await Associado.findOne({
      raw: true,
      where: { UsuarioId: idUsuario },
    });

    const usuario = await Usuario.findOne({raw: true, where: {id: idUsuario}});
    const data_reserva = req.body.data_reserva;
    const AreasReservaId = req.body.AreasReservaId;
    const reservas = {
      data_reserva,
      UsuarioId: usuario.id,
      AreasReservaId,
      AssociadoId: associado.id,
    };
    await Reserva.create(reservas);
    const area = await Area.findOne({raw: true, where: {id: AreasReservaId}})
    await Detalhe.create({
      detalhes_alteracao: `Usuário ${usuario.nome_usuario} reservou a ${area.nome_area_reserva}`,
      UsuarioId: idUsuario,
      FuncionarioId: null,
    });
    res.redirect(`/menu/associado/${idUsuario}/reservas`);
  }

  static async filtrarReservaFuncionario(req, res) {
    const area = req.query.AreasReservaId;
    const data = req.query.data_reserva;

    const id = req.session.userId;

    // AREA VAZIA E DATA SELECIONADA - só data no form
    
    if (area === "vazio" && data.length === 10) {

      const listaReservas = await Reserva.findAll({
        raw: true,
        include: [Area, Associado, Usuario],
        where: { data_reserva: data },
      });

     const listaAreas = await Area.findAll({
      raw: true,
  });
        const usuario = await Usuario.findOne({
          raw: true,
          where: {
            id: id,
          },
        })
          res.render("funcionario/reservas", {listaReservas, listaAreas, usuario});
        

      // AREA PREENCHIDA E DATA VAZIA - só area no form - OK
    } else if (area != "vazio" && data.length === 0) {

    
      const listaReservas = await Reserva.findAll({
        raw: true,
        include: [{model: Area,required: true}, Associado, Usuario],
        where: {
          AreasReservaId: area,
        },
      })

      const listaAreas = await Area.findAll({
        raw: true,
      })
      const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id,
        },
      })

      res.render("funcionario/reservas", {listaReservas, listaAreas, usuario});


      // OS 2 CAMPOS PREENCHIDOS
    } else {
      const listaReservas = await Reserva.findAll({
        raw: true,
        include: [Area, Associado, Usuario],
        where: { AreasReservaId: area, data_reserva: data },
      });

      const listaAreas = await Area.findAll({
        raw: true,
      });

      const id = req.params.id;

      if (Funcionario.findOne({ where: { UsuarioId: id } })) {
        Usuario.findOne({
          raw: true,
          where: {
            id: id,
          },
        }).then((usuario) => {
          res.render("funcionario/reservas", {
            listaReservas,
            listaAreas,
            usuario,
          });
        });
      } else {
        res.render("associado/reservas", { listaReservas, listaAreas });
      }
    }
  }

  static async filtrarReservaAssociado(req, res){
    const area = req.query.AreasReservaId;
    const data = req.query.data_reserva;
    const id = req.session.userId;

    const associado = await Associado.findOne({
      raw: true,
      where: {
        UsuarioId: id
      }
    })


    console.log(associado.id)




    // AREA VAZIA E DATA SELECIONADA - só data no form
    
    if (area === "vazio" && data.length === 10) {

      const listaReservas = await Reserva.findAll({
        raw: true,
        include: [Area, Associado],
        where: {
          data_reserva: data,
          AssociadoId: associado.id
        }
     });



     const listaAreas = await Area.findAll({
      raw: true,
  });
        const usuario = await Usuario.findOne({
          raw: true,
          where: {
            id: id,
          },
        })
          res.render("associado/reservas", {listaReservas, listaAreas, usuario});
        

      // AREA PREENCHIDA E DATA VAZIA - só area no form - OK
    } else if (area != "vazio" && data.length === 0) {
      const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id,
        },
      })
      console.log(usuario.id)
      const listaReservas = await Reserva.findAll({
        raw: true,
        include: Area,
        where: {
          AreasReservaId: area,
          AssociadoId: associado.id
        }
      })

      const listaAreas = await Area.findAll({
        raw: true,
      })

      res.render("associado/reservas", {listaReservas, listaAreas, usuario});


      // OS 2 CAMPOS PREENCHIDOS
    } else {

      const listaReservas = await Reserva.findAll({
        raw: true,
        include: Area,
        where: {
          AreasReservaId: area,
          data_reserva: data,
          AssociadoId: associado.id
        }
      });

      const listaAreas = await Area.findAll({
        raw: true,
      });

      const id = req.params.id;

      const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id,
        },
      })

        res.render("associado/reservas", { listaReservas, listaAreas, usuario });

    }
  }


  static async filtrarReservaBuscaReservas(req, res){
    
    const Op = Sequelize.Op;
    const busca = await req.query.busca;
    const id = req.session.userId
    const idUsuario = req.params.id;

    const usuarioAssociado = await Usuario.findOne({raw: true, where: {
      nome_usuario:{[Op.like]: `%${busca}%`}
    }});
    if(usuarioAssociado === null){


      res.redirect(`/menu/funcionario/${idUsuario}/reservas`)
    } else {
      
      const associadoUsuario = await Associado.findOne({
        raw: true,
        where: {
          UsuarioId: usuarioAssociado.id
        }
      })

      const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id
        }
      })
  
      const listaAreas = await Area.findAll({
        raw: true
      })
      const listaReservas = await Reserva.findAll({
        raw: true,
        include: [
          {model: Area, required: true}, Associado, Usuario
        ],
        where: { 
          AssociadoId: associadoUsuario.id
        }
      })
   
      res.render("funcionario/reservas", {listaReservas, usuario, listaAreas})
    }


    
  }
  
  static async deletarReservaAssociado(req, res) {
    const idRes = req.params.idRes
    const id = req.session.userId

    const usuario = await Usuario.findOne({
        raw: true,
        where: {
          id: id
        }
      })
      const associado = await Associado.findOne({
        raw: true,
        where: {
          UsuarioId: id
        }
      })
      
  
      const listaReservas = await Reserva.findAll({
        raw: true,
        where: {
          AssociadoId: associado.id
        },
        include: [
          {
            model: Area,
            required: false
          },
        ],
      });
  
      const listaAreas = await Area.findAll({
        raw: true,
      });

  

    await Reserva.destroy({where: {id: idRes}});

    await Detalhe.create({
      detalhes_alteracao: `Usuário ${usuario.nome_usuario} deletou sua reserva`,
      UsuarioId: id,
      FuncionarioId: null,
    })

     res.redirect(`/menu/associado/${id}/reservas`)

}

  static showReserva(req, res) {
    Reserva.findAll({
      raw: true,
      include: [
        {
          model: Area,
          required: false,
        },
      ],
    }).then((listaReservas) => {
      Area.findAll({
        raw: true,
      }).then((listaAreas) => {
        res.render("reservas", { listaReservas, listaAreas });
      });
    });
  }
};
