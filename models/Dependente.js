const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Usuario = require("./Usuario");
const Associado = require("./Associado");

const Dependente = db.define(
  "Dependente",
  {
    nome_dependente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf_dependente: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    data_nascimento_dependente: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
    tipo_dependente: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

Dependente.belongsTo(Associado);
Associado.hasMany(Dependente);

module.exports = Dependente;