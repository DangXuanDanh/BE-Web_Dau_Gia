const express = require('express');
const app = new express.Router();

const LichSuDauGia = require('../../models/lichsudaugia.model');
const SanPham = require('../../models/sanpham.model');

function validate() {
    return async function (req, res, next) {
        // const customer = {
        //     customer_id: req.body.customer_id,
        //     store_id: req.body.store_id,
        //     first_name: req.body.first_name,
        //     last_name: req.body.last_name,
        //     email: req.body.email,
        //     address_id: req.body.address_id,
        //     active: req.body.active
        // }

        // await LichSuDauGia.build(customer).validate().then((e) => console.log(e))
        // .catch((err) =>  res.status(400).json({success:false}))

        next()
    }
}


app.route('/:id')
    .get(async function (req, res) {
        res.status(200).json(await LichSuDauGia.findOne({
            where: {
                malichsudaugia: req.params.id
            }
        }));
    })
    .delete(async function (req, res, next) {
        customer = await LichSuDauGia.destroy({
            where: {
                malichsudaugia: req.params.id,
            },
        });
        res.status(204).json(customer);
    })

app.route('/sanpham/:id')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        customers = await LichSuDauGia.findAll({
            order: [
                ['ngaydaugia', 'DESC']
            ],
            limit: 5 ,
            where: {
                masanpham: req.params.id
            }
        });
        res.status(200).json(customers);
    })

app.route('/')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        customers = await LichSuDauGia.findAll({
            order: [
                ['ngaydaugia', 'DESC']
            ],
            // include: SanPham
        });
        res.status(200).json(customers);
    })
    .post(validate(), async function (req, res, next) {
        customer = await LichSuDauGia.create({
            masanpham: req.body.masanpham,
            mataikhoan: req.body.mataikhoan,
            gia: req.body.gia,
        });
        res.status(200).json(customer);
    })
    .put(validate(), async function (req, res, next) {
        customer = await LichSuDauGia.update({
            masanpham: req.body.masanpham,
            mataikhoan: req.body.mataikhoan,
            gia: req.body.gia,
        },
            {
                where: {
                    malichsudaugia: req.body.malichsudaugia,
                },
            });
        res.status(200).json(customer);
    })



module.exports = app;