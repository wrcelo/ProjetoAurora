const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Funcionario = require("./Funcionario");
const Usuario = require("./Usuario");

const Detalhe = db.define('Detalhes_alteracao', {
    detalhes_alteracao: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
  },
  {
    updatedAt: false
  }
);

Detalhe.belongsTo(Usuario);
Detalhe.belongsTo(Funcionario);

Usuario.hasMany(Detalhe);
Funcionario.hasMany(Detalhe);

module.exports = Detalhe;