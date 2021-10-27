const express = require('express');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const AnhSanPham = require('../../models/anhsanpham.model');

function validate() {
    return async function (req, res, next) {
        // const actor = {
        //     actor_id: req.body.actor_id,
        //     first_name: req.body.first_name,
        //     last_name: req.body.last_name
        // }

        // await DanhMuc.build(actor).validate().then((e) => console.log(e))
        // .catch((err) =>  res.status(400).json({success:false}))

        next()
    }
}

app.route('/anh/:id')
.get(async function (req, res) {
    res.status(200).json(await AnhSanPham.findOne({
        where: {
            mahinhanh: req.params.id
        },
    }));
})
.delete(async function (req, res, next) {
    actor = await AnhSanPham.destroy({
        where: {
            mahinhanh: req.params.id,
        },
    });
    res.status(204).json(actor);
})

app.route('/sanpham/:id')
.get(async function (req, res) {
    res.status(200).json(await AnhSanPham.findAll({
        where: {
            masanpham: req.params.id
        },
    }));
})

app.route('/')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        actors = await AnhSanPham.findAll();
        res.status(200).json(actors);
    })
    .post(validate(),async function (req, res, next) {
        actor = await AnhSanPham.create({
            url: req.body.url,
            masanpham: req.body.masanpham,
            sanphamMasanpham: req.body.masanpham,
        });
        res.status(200).json(actor);
    })
    .put(validate(),async function (req, res, next) {
        actor = await AnhSanPham.update({
            url: req.body.url,
            masanpham: req.body.masanpham,
        },
            {
                where: {
                    mahinhanh: req.body.mahinhanh,
                },
            });
        res.json(actor);
    })



module.exports = app;