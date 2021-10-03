const db = require('../services/db')
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class SanPham extends Model {
  
    static async findIDchat(actor_id) {
        return SanPham.findOne({
            where: {
                actor_id,
            }
        });
    }
}
// chat Table Created Method
SanPham.init({
    masanpham: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tensanpham: {
        type: Sequelize.STRING,
        // validate:{
        //     notEmpty: true,
        //     isInt: true,
        // }
    },
    mota: {
        type: Sequelize.TEXT,
    },
    madanhmuc: {
        type: Sequelize.INTEGER,
    },
    maanhdaidien: {
        type: Sequelize.INTEGER,
    },
    giakhoidiem: {
        type: Sequelize.DECIMAL,
    },
    giamuangay: {
        type: Sequelize.DECIMAL,
    },
    buocgia: {
        type: Sequelize.DECIMAL,
    },
    malichsucaonhat: {
        type: Sequelize.INTEGER,
    },
    tudonggiahan: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    ngaydang:{
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    ngayketthuc: {
        type: 'TIMESTAMP',
    },
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false,
    sequelize: db, // We need to pass the connection instance
    modelName: 'sanpham', // We need to choose the model name,
});

module.exports = SanPham