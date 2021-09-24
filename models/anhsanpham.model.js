const db = require('../services/db')
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class AnhSanPham extends Model {
  
    static async findIDchat(actor_id) {
        return SanPham.findOne({
            where: {
                actor_id,
            }
        });
    }
}
// chat Table Created Method
AnhSanPham.init({
    mahinhanh: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: Sequelize.STRING,
    },
    masanpham: {
        type: Sequelize.INTEGER,
    },
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false,
    sequelize: db, // We need to pass the connection instance
    modelName: 'anhsanpham', // We need to choose the model name,
});

module.exports = AnhSanPham