const express = require('express');
const moment = require('moment');
require('moment/locale/vi');
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
        console.log(user.hoten);
        if(user === null)
        {
            return res.status(204).end();
        }
        
        if (user.matkhau == body.password) {
            const userReturned =
            {
                mataikhoan: user.mataikhoan,
                hoten: user.hoten,
                status: user.activate_status
            }
            return res.json(userReturned).status(200).end();
        }else{
            return res.status(403).end();
        }

    }

})

app.route('/profile/:userId')
.get(async (req, res)=> {
    const id = req.params.userId || 0;
    if (id === 0 || id === null) {
        return res.status(404).end();
    }
    else{
        var result = await TaiKhoan.findById(id);
        if (result === 0 || result === null) {
            return res.status(404).end();
        }
        else{
            var formatted_date = null;
            if(result.ngaysinh != null)
            {
                formatted_date = moment(result.ngaysinh).format('DD-MM-YYYY');
            }
            returnResult = {
                hoten: result.hoten,
                email: result.email,
                ngaysinh: formatted_date,
                diachi: result.diachi
            }
            return res.json(returnResult).status(200).end();
        }
    }
  });

  app.route('/update')
  .patch(async (req, res)=> {
    const body = req.body;
    /*let temptime = new Date(body.ngaysinh)
    temptime.toLocaleDateString('en-GB')
    time = moment(body.ngaysinh).format('DD/MM/YYYY')
    console.log("Time :" + time);
    console.log(body.ngaysinh)*/
    const user = {
        hoten: body.hoten,
        email: body.email,
        ngaysinh: body.ngaysinh,
        diachi: body.diachi
    }
    const id = body.mataikhoan;
    const result = await TaiKhoan.patch(id,user);
    console.log(result)
    if(result == 0)
    {
        return res.status(404).end();
    }else{
        return res.json(result).status(200).end();
    }
    
  });
module.exports = app;