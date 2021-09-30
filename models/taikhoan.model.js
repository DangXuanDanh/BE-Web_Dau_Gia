const db = require('../services/db')
const Sequelize = require('sequelize')
const tableName = 'taikhoan';
const Model = Sequelize.Model

class TaiKhoan extends Model {
  
    static async findByMail(email) {
        const rows = await TaiKhoan.findOne({
            where :{
                email,
            }
        })
        if(rows.length === 0)
        {
            return null;
        }
        return rows;
    }
}
// chat Table Created Method
TaiKhoan.init({
    mataikhoan: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hoten: {
        type: Sequelize.STRING,
        // validate:{
        //     notEmpty: true,
        //     isInt: true,
        // }
    },
    email: {
        type: Sequelize.STRING,
    },
    matkhau: {
        type: Sequelize.STRING,
    },
    ngaysinh:{
        type: 'TIMESTAMP',
    },
    diachi: {
        type: Sequelize.STRING,
    },
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false,
    sequelize: db, // We need to pass the connection instance
    modelName: 'taikhoan', // We need to choose the model name,
});

module.exports = TaiKhoan