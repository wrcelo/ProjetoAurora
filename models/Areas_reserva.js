const db = require('../db/conn');
const {DataTypes} = require('sequelize');

const Area = db.define('Areas_reserva', {
    
    nome_area_reserva: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descricao_area_reserva: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
},
    {
    timestamps: false,
    createdAt: false,
    updatedAt: false
    });


module.exports = Area;