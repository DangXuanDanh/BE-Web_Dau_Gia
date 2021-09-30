const express = require('express');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const TaiKhoan = require('../../models/taikhoan.model');

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

app.route('/login')
.post(async function (req, res) {
    const body = req.body;
    console.log(body);
    if(body.email == null || body.password == null)
    {
        return res.status(403).end();
    }else{
        const user = await TaiKhoan.findByMail(body.email);
        if(user === null)
        {
            return res.status(204).end();
        }
    }
})


module.exports = app;