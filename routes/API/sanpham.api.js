const express = require('express');
const app = new express.Router();

const SanPham = require('../../models/sanpham.model');

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
            actor_id: req.params.id
        }
    }));
})
.delete(async function (req, res, next) {
    actor = await SanPham.destroy({
        where: {
            actor_id: req.params.id,
        },
    });
    res.json(actor);
})

app.route('/')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        actors = await SanPham.findAll({
            order: [
                ['last_update', 'DESC']
            ],
        });
        res.json(actors);
    })
    .post(validate(),async function (req, res, next) {
        actor = await SanPham.create({
            actor_id: req.body.actor_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        });
        res.json(actor);
    })
    .put(validate(),async function (req, res, next) {
        actor = await SanPham.update({
            first_name: req.body.first_name,
            last_name: req.body.last_name
        },
            {
                where: {
                    actor_id: req.body.actor_id,
                },
            });
        res.json(actor);
    })



module.exports = app;