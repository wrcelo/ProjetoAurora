const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const Login = require("../models/Login");

module.exports = class LoginController {
  static login(req, res) {
    const email = req.body.login;
    Usuario.findOne({ raw: true, where: { email_usuario: email } })
      .then(async (usuario) => {
        const senha = req.body.senha;
        //gambiara pro administrador poder logar, já que nao estamos usando criptografia na senha dele
        let senhaCadastrada = "";
        if (usuario.PerfiId === 4) {
          senhaCadastrada = bcrypt.compareSync(senha, usuario.senha_usuario);
        } else {
          senhaCadastrada = senha;
        }
        if (senhaCadastrada) {
          req.session.userId = usuario.id;
          if (usuario.PerfiId != 4) {
            req.session.perfil = usuario.PerfiId;
            await Login.create({
              detalhes_login: `Funcionario logou no Sistema`,
              FuncionarioId: usuario.id,
            });
            req.session.save(() => {
              console.log("Fez o login de forma correta!");
              res.redirect(`/menu/funcionario/${usuario.id}`);
            });
          } else if (usuario.PerfiId === 4) {
            req.session.perfil = usuario.PerfiId;
            await Login.create({
              detalhes_login: "Associado Logou no Sistema",
              UsuarioId: usuario.id,
            });
            req.session.save(() => {
              console.log("Fez o login de forma correta!");
              res.redirect(`/menu/associado/${usuario.id}`);
            });
          }
        } else {
          console.log("E-mail ou senha inválidos");
          req.flash("message", "E-mail ou senha inválidos");
          res.redirect(`/`);
        }
      })
      .catch((err) => {
        console.log("E-mail ou senha inválidos", err);
        req.flash("message", "E-mail ou senha inválidos");
        res.redirect(`/`);
      });
  }

  static logout(req, res) {
    if (req.session.userId) {
      req.session.destroy();
      res.redirect("/");
    }
  }
};
