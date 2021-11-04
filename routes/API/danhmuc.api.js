const express = require('express');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const DanhMuc = require('../../models/danhmuc.model');

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

app.route('/:id')
.get(async function (req, res) {
    res.status(200).json(await DanhMuc.findOne({
        where: {
            madanhmuc: req.params.id
        },
    }));
})
.put(validate(),async function (req, res, next) {
    actor = await DanhMuc.update({
        tendanhmuc: req.body.tendanhmuc,
        is_deleted: req.body.is_deleted,
    },
        {
            where: {
                madanhmuc: req.params.id
            },
        });
    res.json(actor);
})
.delete(async function (req, res, next) {
    actor = await DanhMuc.destroy({
        where: {
            madanhmuc: req.params.id,
        },
    });
    res.status(204).json(actor);
})

app.route('/danhmuccon/:id')
.get(async function (req, res) {
    res.status(200).json(await DanhMuc.findAll({
        where: {
            madanhmuccha: req.params.id,
            is_deleted : 0
        },
    }));
})

app.route('/danhmuccha/get')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        actors = await DanhMuc.findAll({
            order: [
                ['madanhmuc', 'DESC']
            ],
            where: {
                madanhmuccha: null,
                is_deleted : 0
            }
        });
        res.status(200).json(actors);
    })

    app.route('/all/get')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        actors = await DanhMuc.findAll({
            order: [
                ['madanhmuc', 'DESC']
            ],
            where: {
                is_deleted : 0
            }
        });
        res.status(200).json(actors);
    })

app.route('/')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        actors = await DanhMuc.findAll({
            order: [
                ['madanhmuc', 'DESC']
            ],
            where: {
                madanhmuccha: {[Op.ne]: null},
                is_deleted : 0
            }
        });
        res.status(200).json(actors);
    })
    .post(validate(),async function (req, res, next) {

        actor = await DanhMuc.create({
            tendanhmuc: req.body.tendanhmuc,
            madanhmuccha: req.body.madanhmuccha,
        });
        res.status(200).json(actor);
    })
    .put(validate(),async function (req, res, next) {
        actor = await DanhMuc.update({
            tendanhmuc: req.body.tendanhmuc,
        },
            {
                where: {
                    madanhmuc: req.body.madanhmuc,
                },
            });
        res.json(actor);
    })

module.exports = app;