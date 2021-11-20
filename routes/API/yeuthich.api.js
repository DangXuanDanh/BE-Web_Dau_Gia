const express = require('express');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const YeuThich = require('../../models/yeuthich.model');
const SanPham = require('../../models/sanpham.model');

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

app.route('/find/:mataikhoan/:masanpham')
    .get(async function (req, res) {
        res.status(200).json(await YeuThich.findOne({
            where: {
                mataikhoan: req.params.mataikhoan,
                masanpham: req.params.masanpham,
            },
        }));
    })
    .delete(async function (req, res, next) {
        actor = await YeuThich.destroy({
            where: {
                mataikhoan: req.params.mataikhoan,
                masanpham: req.params.masanpham,
            },
        });
        res.status(204).json(actor);
    })

app.route('/findAll/:id')
    .get(async function (req, res) {
        let ids = []
        ids = await YeuThich.findAll({
            where: {
                mataikhoan: req.params.id
            },
            order: [
                ['updatedAt', 'DESC']
            ],
        }).then(async r => {

            let sp = []
            await Promise.all(
                r.map(async e => {
                    await SanPham.findOne({
                        where: {
                            masanpham: e.masanpham
                        },
                    }).then(async (result) => {
                        sp.push(result)
                        console.log(sp.length)
                    })
                })
            )
            res.status(200).json(sp);
            return
        })


        res.status(200).json();
    })

app.route('/')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        actors = await YeuThich.findAll();
        res.status(200).json(actors);
    })
    .post(validate(), async function (req, res, next) {
        const find = await YeuThich.findOne({
            where: {
                masanpham: req.body.masanpham,
                mataikhoan: req.body.mataikhoan,
            },
        });

        if (find) {
            res.status(400).json("existence");
            return
        }

        actor = await YeuThich.create({
            mataikhoan: req.body.mataikhoan,
            masanpham: req.body.masanpham,
        });
        res.status(200).json(actor);
    })
    .put(validate(), async function (req, res, next) {
        actor = await YeuThich.update({
            mataikhoan: req.body.mataikhoan,
            masanpham: req.body.masanpham,
        },
            {
                where: {
                    mayeuthich: req.body.mayeuthich,
                },
            });
        res.json(actor);
    })



module.exports = app;