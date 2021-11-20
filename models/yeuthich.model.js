const db = require('../services/db')
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class YeuThich extends Model {
  

}
// chat Table Created Method
YeuThich.init({
    mayeuthich: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mataikhoan: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    masanpham: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
}, {
    // Other model options go here
    freezeTableName: true,
    // timestamps: false,
    sequelize: db, // We need to pass the connection instance
    modelName: 'yeuthich', // We need to choose the model name,
});

module.exports = YeuThich