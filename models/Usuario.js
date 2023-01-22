const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Perfil = require("./Perfi");

const Usuario = db.define('Usuario', {
    nome_usuario: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cpf_usuario: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    senha_usuario: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    data_nascimento_usuario: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    email_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

Usuario.belongsTo(Perfil);
Perfil.hasMany(Usuario);


module.exports = Usuario;
