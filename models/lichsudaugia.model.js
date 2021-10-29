const db = require('../services/db')
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class LichSuDauGia extends Model {
  
    static async findIDchat(actor_id) {
        return SanPham.findOne({
            where: {
                actor_id,
            }
        });
    }
}
// chat Table Created Method
LichSuDauGia.init({
    malichsudaugia: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    masanpham: {
        type: Sequelize.INTEGER,
    },
    mataikhoan: {
        type: Sequelize.INTEGER,
    },
    gia: {
        type: Sequelize.DECIMAL,
    },
    giacaonhat: {
        type: Sequelize.DECIMAL,
    },
    ngaydaugia:{
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false,
    sequelize: db, // We need to pass the connection instance
    modelName: 'lichsudaugia', // We need to choose the model name,
});

module.exports = LichSuDauGia