const express = require('express');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const SanPham = require('../../models/sanpham.model');
const DanhMuc = require('../../models/danhmuc.model');

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
    res.status(200).json(await SanPham.findOne({
        where: {
            masanpham: req.params.id
        },
        include: DanhMuc
    }));
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

        let days = parseInt(req.body.songayketthuc) || 0

        let time = new Date()
        time.setDate(time.getDate() + days)

        actor = await SanPham.create({
            tensanpham: req.body.tensanpham,
            mota: req.body.mota,
            loaisanpham: req.body.loaisanpham,
            maanhdaidien: req.body.maanhdaidien,
            giakhoidiem: req.body.giakhoidiem,
            giamuangay: req.body.giamuangay,
            buocgia: req.body.buocgia,
            tudonggiahan: req.body.tudonggiahan,
            ngayketthuc: time
        });
        res.status(200).json(actor);
    })
    .put(validate(),async function (req, res, next) {

        let days = parseInt(req.body.songayketthuc) || 0

        let time = new Date()
        time.setDate(time.getDate() + days)

        actor = await SanPham.update({
            tensanpham: req.body.tensanpham,
            mota: req.body.mota,
            loaisanpham: req.body.loaisanpham,
            maanhdaidien: req.body.maanhdaidien,
            giakhoidiem: req.body.giakhoidiem,
            giamuangay: req.body.giamuangay,
            buocgia: req.body.buocgia,
            tudonggiahan: req.body.tudonggiahan,
            ngayketthuc: time
        },
            {
                where: {
                    masanpham: req.body.masanpham,
                },
            });
        res.json(actor);
    })



module.exports = app;