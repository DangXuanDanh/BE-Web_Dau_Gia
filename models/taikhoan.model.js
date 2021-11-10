const db = require('../services/db')
const Sequelize = require('sequelize')
const tableName = 'taikhoan';
const Model = Sequelize.Model

class TaiKhoan extends Model {

    static async findByMail(email) {
        const rows = await TaiKhoan.findOne({
            where: {
                email,
            }
        })
        if (rows.length === 0) {
            return null;
        }
        return rows;
    }

    static async findById(id) {
        const rows = await TaiKhoan.findOne({
            where: {
                mataikhoan: id,
            }
        })
        if (rows.length === 0) {
            return null;
        }
        return rows;
    }

    static async findByActivate_upgrade(activate_upgrade) {
        const rows = await TaiKhoan.findAll({
            where: {
                activate_upgrade: activate_upgrade,
                role : 1
            }
        })
        if (rows.length === 0) {
            return null;
        }
        return rows;
    }

    static patch(id, user_noId) {
        return TaiKhoan.update(
            user_noId, {
                where: {
                    mataikhoan: id,
                },
            });
    }

    static delete(id) {
        return TaiKhoan.destroy({
            where: {
                mataikhoan: id,
            },
        });
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
    ngaysinh: {
        type: 'TIMESTAMP',
    },
    diachi: {
        type: Sequelize.STRING,
    },
    activate_status: {
        type: Sequelize.INTEGER,
    },
    danhgiatot: {
        type: Sequelize.INTEGER,
    },
    danhgiaxau: {
        type: Sequelize.INTEGER,
    },
    role:{
        type: Sequelize.INTEGER,
    },
    activate_upgrade:{
        type: Sequelize.INTEGER,
    },
    exp_seller:{
        type: 'TIMESTAMP',
    },
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false,
    sequelize: db, // We need to pass the connection instance
    modelName: 'taikhoan', // We need to choose the model name,
});

module.exports = TaiKhoan