const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Usuario = require("./Usuario");

const Funcionario = db.define(
  "Funcionario",
  {
    cargo_funcionario: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    matricula_funcionario: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

Funcionario.belongsTo(Usuario);
Usuario.hasOne(Funcionario);

module.exports = Funcionario;