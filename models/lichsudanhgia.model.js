const db = require('../services/db')
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class LichSuDanhGia extends Model {
    static async selectRawQuery(query,replace) {
        return LichSuDanhGia.sequelize.query(query,
            {
                replacements: replace,
                type: Sequelize.SELECT,
                model: LichSuDanhGia,
                mapToModel: true
            } 
        );
    }

}
// chat Table Created Method
LichSuDanhGia.init({
    malichsudanhgia: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mataikhoan: {
        type: Sequelize.INTEGER,
    },
    masanpham: {
        type: Sequelize.INTEGER,
    },
    danhgia: {
        type: Sequelize.INTEGER,
    },
    languoiban: {
        type: Sequelize.INTEGER,
    },
}, {
    // Other model options go here
    freezeTableName: true,
    // timestamps: false,
    sequelize: db, // We need to pass the connection instance
    modelName: 'lichsudanhgia', // We need to choose the model name,
});

module.exports = LichSuDanhGia