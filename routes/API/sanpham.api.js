const express = require('express');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const SanPham = require('../../models/sanpham.model');
const DanhMuc = require('../../models/danhmuc.model');
const AnhSanPham = require('../../models/anhsanpham.model');

function validate() {
    return async function (req, res, next) {
        // const actor = {
        //     actor_id: req.body.actor_id,
        //     first_name: req.body.first_name,
        //     last_name: req.body.last_name
        // }

        // await SanPham.build(actor).validate().then((e) => console.log(e))
        // .catch((err) =>  res.status(400).json({success:false}))

        next()
    }
}

app.route('/:id')
.get(async function (req, res) {
    let sp = await SanPham.findOne({
        where: {
            masanpham: req.params.id
        },
        // raw: true,
        // nest: true,
        include: [DanhMuc, AnhSanPham]
    })
    sp = sp.toJSON()
    sp.thoigian = sp.ngayketthuc - new Date()
    res.status(200).json(sp);
})
.delete(async function (req, res, next) {
    actor = await SanPham.destroy({
        where: {
            masanpham: req.params.id,
        },
    });
    res.status(204).json(actor);
})

app.route('/')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        actors = await SanPham.findAll({
            order: [
                ['ngaydang', 'DESC']
            ],
            where:{
                ngayketthuc: {
                    [Op.gte]: Sequelize.literal('CURRENT_TIMESTAMP')
                  }
            }
        });
        res.status(200).json(actors);
    })
    .post(validate(),async function (req, res, next) {

        actor = await SanPham.create({
            tensanpham: req.body.tensanpham,
            mota: req.body.mota,
            madanhmuc: req.body.madanhmuc,
            maanhdaidien: req.body.maanhdaidien,
            giakhoidiem: req.body.giakhoidiem,
            giamuangay: req.body.giamuangay,
            buocgia: req.body.buocgia,
            tudonggiahan: req.body.tudonggiahan,
            ngayketthuc: req.body.ngayketthuc
        });
        res.status(200).json(actor);
    })
    .put(validate(),async function (req, res, next) {

        actor = await SanPham.update({
            tensanpham: req.body.tensanpham,
            mota: req.body.mota,
            madanhmuc: req.body.madanhmuc,
            maanhdaidien: req.body.maanhdaidien,
            giakhoidiem: req.body.giakhoidiem,
            giamuangay: req.body.giamuangay,
            buocgia: req.body.buocgia,
            tudonggiahan: req.body.tudonggiahan,
            ngayketthuc: req.body.ngayketthuc
        },
            {
                where: {
                    masanpham: req.body.masanpham,
                },
            });
        res.json(actor);
    })
//5 San pham co gia cao nhat
app.route('/get/MaxPrice').get(async function (req, res) {
        console.log("GET START");
        let sp = await SanPham.selectRawQuery('SELECT * FROM sanpham order by giakhoidiem desc LIMIT :limit',{ limit: 5 })
        console.log(sp);
        res.status(200).json(sp);
}) 
//5 San pham gan ket thuc    
app.route('/get/NearEnd').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery(`SELECT * FROM sanpham 
    WHERE (interval '0 days')<=age(ngayketthuc,CURRENT_TIMESTAMP) and age(ngayketthuc,CURRENT_TIMESTAMP)<=(interval '3 days')
    LIMIT :limit`,{ limit: 5 })
    res.status(200).json(sp);
})
//5 San pham luot ra gia cao nhat
app.route('/get/NearEnd').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery(`SELECT * FROM sanpham 
    WHERE (interval '0 days')<=age(ngayketthuc,CURRENT_TIMESTAMP) and age(ngayketthuc,CURRENT_TIMESTAMP)<=(interval '3 days')
    LIMIT :limit`,{ limit: 5 })
    res.status(200).json(sp);
})       
app.route('/get/Count').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery(`SELECT * FROM sanpham 
    WHERE (interval '0 days')<=age(ngayketthuc,CURRENT_TIMESTAMP) and age(ngayketthuc,CURRENT_TIMESTAMP)<=(interval '3 days')
    LIMIT :limit`,{ limit: 5 })
    res.status(200).json(sp);
})   
// Lay san pham theo danh muc
app.route('/get/category/:id').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery(`SELECT * FROM sanpham 
    WHERE madanhmuc=:id`,{ id: req.params.id })
    res.status(200).json(sp);
}) 
module.exports = app;