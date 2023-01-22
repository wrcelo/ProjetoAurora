const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Funcionario = require("./Funcionario");
const Usuario = require("./Usuario");

const Login = db.define('Login', {
    detalhes_login: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
  },
  {
    updatedAt: false
  }
);

Login.belongsTo(Usuario);
Login.belongsTo(Funcionario);

Usuario.hasMany(Login);
Funcionario.hasMany(Login);

module.exports = Login;