const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Usuario = require("./Usuario");

const Associado = db.define(
  "Associado",
  {
    genero_associado: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Desativado'
    }
  },
  {
    updatedAt: false
  }
);

Associado.belongsTo(Usuario, {
  onDelete: 'cascade'
});
Usuario.hasOne(Associado, {
  onDelete: 'cascade'
});

module.exports = Associado;