const db = require('../db/conn');
const {DataTypes} = require('sequelize');
const Associado = require('./Associado');
const Area = require('./Areas_reserva');
const Usuario = require('./Usuario')

const Reserva = db.define('Reserva', {
    data_reserva: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
},
    {
    timestamps: false,
    createdAt: false,
    updatedAt: false
    });

Reserva.belongsTo(Associado);
Reserva.belongsTo(Usuario);
Reserva.belongsTo(Area);

Associado.hasMany(Reserva);
Usuario.hasMany(Reserva);
Area.hasMany(Reserva);


module.exports = Reserva;