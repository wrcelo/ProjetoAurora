const db = require('../db/conn');
const {DataTypes} = require('sequelize');

const Perfil = db.define('Perfi', {
    nome_perfil: {
        type: DataTypes.STRING(50),
        allowNull: false
    }},
    {
    timestamps: false,
    createdAt: false,
    updatedAt: false
    });


module.exports = Perfil;