const express = require('express');
const app = new express.Router();

const LichSuDauGia = require('../../models/lichsudaugia.model');

function validate() {
    return async function (req, res, next) {
        const customer = {
            customer_id: req.body.customer_id,
            store_id: req.body.store_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address_id: req.body.address_id,
            active: req.body.active
        }

        await LichSuDauGia.build(customer).validate().then((e) => console.log(e))
        .catch((err) =>  res.status(400).json({success:false}))

        next()
    }
}


app.route('/:id')
    .get(async function (req, res) {
        res.status(200).json(await LichSuDauGia.findOne({
            where: {
                customer_id: req.params.id
            }
        }));
    })
    .delete(async function (req, res, next) {
        customer = await LichSuDauGia.destroy({
            where: {
                customer_id: req.params.id,
            },
        });
        res.json(customer);
    })

app.route('/')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        customers = await LichSuDauGia.findAll({
            order: [
                ['last_update', 'DESC']
            ],
        });
        res.json(customers);
    })
    .post(validate(), async function (req, res, next) {
        customer = await LichSuDauGia.create({
            customer_id: req.body.customer_id,
            store_id: req.body.store_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address_id: req.body.address_id,
            active: req.body.active
        });
        res.json(customer);
    })
    .put(validate(),async function (req, res, next) {
        customer = await LichSuDauGia.update({
            store_id: req.body.store_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address_id: req.body.address_id,
            active: req.body.active,
        },
            {
                where: {
                    customer_id: req.body.customer_id,
                },
            });
        res.json(customer);
    })



module.exports = app;