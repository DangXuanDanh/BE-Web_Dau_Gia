const express = require('express');
const moment = require('moment');
require('moment/locale/vi');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt');

const saltRounds = 10;

const TaiKhoan = require('../../models/taikhoan.model');

function validate() {
    return async function(req, res, next) {
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

app.route('/alluser')
    .get(async function(req, res) {
        const user = await TaiKhoan.findAll();
        return res.json(user).status(200).end();
    })

app.route('/login')
    .post(async function(req, res) {
        const body = req.body;
        console.log(body);
        if (body.email == null || body.password == null) {
            return res.status(403).end();
        } else {
            const user = await TaiKhoan.findByMail(body.email);
            console.log(user.hoten);
            if (user === null) {
                return res.status(204).end();
            }
            const hashed = user.matkhau;
            var validUser = bcrypt.compareSync(body.password, hashed)

            if (validUser) {
                const userReturned = {
                    mataikhoan: user.mataikhoan,
                    hoten: user.hoten,
                    status: user.activate_status
                }
                return res.json(userReturned).status(200).end();
            } else {
                return res.status(403).end();
            }

        }

    })

app.route('/profile/:userId')
    .get(async(req, res) => {
        const id = req.params.userId || 0;
        if (id === 0 || id === null) {
            return res.status(404).end();
        } else {
            var result = await TaiKhoan.findById(id);
            if (result === 0 || result === null) {
                return res.status(404).end();
            } else {
                returnResult = {
                    hoten: result.hoten,
                    email: result.email,
                    ngaysinh: result.ngaysinh,
                    diachi: result.diachi
                }
                return res.json(returnResult).status(200).end();
            }
        }
    });

    app.route('/profileuser/:userId')
    .get(async(req, res) => {
        const id = req.params.userId || 0;
        if (id === 0 || id === null) {
            return res.status(404).end();
        } else {
            var result = await TaiKhoan.findById(id);
            if (result === 0 || result === null) {
                return res.status(404).end();
            } else {
                var formatted_date = null;
                if (result.ngaysinh != null) {
                    formatted_date = moment(result.ngaysinh).format('DD-MM-YYYY');
                }
                returnResult = {
                    id: result.mataikhoan,
                    hoten: result.hoten,
                    email: result.email,
                    ngaysinh: formatted_date,
                    diachi: result.diachi,
                    activate_status: result.activate_status,
                    danhgiatot: result.danhgiatot,
                    danhgiaxau: result.danhgiaxau
                    }
                return res.json(returnResult).status(200).end();
            }
        }
    });

app.route('/delete/:userId')
    .delete(async(req, res) => {
        const id = +req.params.userId || 0;
        const result = await TaiKhoan.delete(id);
        if (result === 0) {
            return res.status(404).end();
        } else {
            return res.json({
                message: 'User deleted.'
            }).status(201).end();
        }
    })

app.route('/update')
    .patch(async(req, res) => {
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
        const result = await TaiKhoan.patch(id, user);
        console.log(result)
        if (result == 0) {
            return res.status(404).end();
        } else {
            return res.json(result).status(200).end();
        }

    });

app.route('/change-profile-password')
    .post(async(req, res) => {
        const body = req.body;
        if (body === null || body === 0) {
            return res.status(404).end();
        } else {
            const user_record = await TaiKhoan.findById(body.mataikhoan);
            if (user_record === null || user_record === 0) {
                return res.status(404).end();
            } else {
                const user = {
                    matkhau: user_record.matkhau,
                }
                const userId = user_record.mataikhoan;
                var oldPassword = body.oldPassword;
                const salt = bcrypt.genSaltSync(saltRounds);
                var newPassword = bcrypt.hashSync(body.newPassword, salt);
                var validOldPassword = bcrypt.compareSync(oldPassword, user_record.matkhau)
                if (validOldPassword) {
                    user.matkhau = newPassword;
                    await TaiKhoan.patch(userId, user);
                    return res.status(200).end();
                } else {
                    return res.status(400).end();
                }
            }
        }
    });
module.exports = app;