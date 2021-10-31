const db = require('../services/db')
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class DanhMuc extends Model {
  
    static async findIDchat(actor_id) {
        return SanPham.findOne({
            where: {
                actor_id,
            }
        });
    }
}
// chat Table Created Method
DanhMuc.init({
    madanhmuc: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tendanhmuc: {
        type: Sequelize.STRING,
    },
    madanhmuccha: {
        type: Sequelize.INTEGER,
    },
    is_deleted: {
        type: Sequelize.INTEGER,
    },
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false,
    sequelize: db, // We need to pass the connection instance
    modelName: 'danhmuc', // We need to choose the model name,
});

module.exports = DanhMuc