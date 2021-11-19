const express = require('express');
const moment = require('moment');
require('moment/locale/vi');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt');

const Email = require('../../services/mailer');

const saltRounds = 10;

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

app.route('/alluser')
    .get(async function (req, res) {
        const user = await TaiKhoan.findAll();
        return res.json(user).status(200).end();
    })

app.route('/allactivate_upgrade')
    .get(async function (req, res) {
        const user = await TaiKhoan.findByActivate_upgrade(1);
        return res.json(user).status(200).end();
    })

app.route('/register')
    .post(async function (req, res) {
        const body = req.body;

        const user = await TaiKhoan.findByMail(body.email);
        if (user === null) {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(body.password, salt);
            var code = randomString();

            const regUser = {
                hoten: body.hoten,
                email: body.email,
                ngaysinh: body.ngaysinh,
                diachi: body.diachi,
                matkhau: hash,
                role: 1,
                danhgiatot: 0,
                danhgiaxau: 0,
                activate_status: 0,
                activate_upgrade: 0,
                otd_code: code
            }
            const result = await TaiKhoan.create(regUser);

            await Email.send(body.email, 'Active Account', `Mã xác nhận : Vào ${process.env.BASE_URL || 'http://localhost:5000'}/activeAccount/${code} để kích hoạt tài khoản!`);
            return res.json({
                message: "user created"
            }).status(200).end();
        }
        else {
            return res.status(304).end();
        }
    })

app.route('/activate-account')
    .post(async function (req, res) {
        const activate_code = req.body.code;
        if (activate_code === 0 || activate_code === null) {
            return res.status(404).end();
        }
        else {
            const result = await TaiKhoan.findByCode(activate_code);
            if (result === 0 || result === null) {
                return res.status(404).end();
            }
            else {
                const userID = result.mataikhoan;
                const user = {
                    activate_status: 1,
                }
                await TaiKhoan.patch(userID, user);
                return res.json({
                    message: "User activation successfully"
                }).status(200).end();
            }
        }
    })

app.route('/login')
    .post(async function (req, res) {
        const body = req.body;
        if (body.email == null || body.password == null) {
            return res.status(403).end();
        } else {
            var email = body.email;
            var datetemp = new Date();
            const user = await TaiKhoan.findByMail(body.email);
            if (user === null) {
                return res.status(204).end();
            } else {
                if (user.exp_seller <= datetemp && user.role == 2) {
                    const userdetal = {
                        role: 1,
                    }
                    const result = await TaiKhoan.patch(user.mataikhoan, userdetal);
                    user.role = 1;
                }
                const hashed = user.matkhau;
                var validUser = bcrypt.compareSync(body.password, hashed)

                if (validUser) {
                    console.log("---------------" + user.role)
                    const userReturned = {
                        mataikhoan: user.mataikhoan,
                        hoten: user.hoten,
                        status: user.activate_status,
                        role: user.role,
                        activate_upgrade: user.activate_upgrade,
                        exp_seller: user.exp_seller
                    }
                    return res.json(userReturned).status(200).end();
                } else {
                    return res.status(403).end();
                }
            }


        }

    })

app.route('/profile/:userId')
    .get(async (req, res) => {
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
                    diachi: result.diachi,
                    role: result.role,
                    danhgiatot: result.danhgiatot,
                    danhgiaxau: result.danhgiaxau,
                    activate_upgrade: result.activate_upgrade
                }
                return res.json(returnResult).status(200).end();
            }
        }
    });

app.route('/profileuser/:userId')
    .get(async (req, res) => {
        const id = +req.params.userId || 0;
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
                    role: result.role,
                    activate_status: result.activate_status,
                    danhgiatot: result.danhgiatot,
                    danhgiaxau: result.danhgiaxau
                }
                return res.json(returnResult).status(200).end();
            }
        }
    });

app.route('/delete/:userId')
    .delete(async (req, res) => {
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
    .patch(async (req, res) => {
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
            diachi: body.diachi,
            activate_upgrade: body.activate_upgrade,
            role: body.role,
            activate_upgrade: body.activate_upgrade,
            exp_seller: body.exp_seller
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


app.route('/upgrade/:userId')
    .patch(async (req, res) => {
        const id = +req.params.userId || 0;
        const body = req.body;
        /*let temptime = new Date(body.ngaysinh)
        temptime.toLocaleDateString('en-GB')
        time = moment(body.ngaysinh).format('DD/MM/YYYY')
        console.log("Time :" + time);
        console.log(body.ngaysinh)*/
        const user = {
            role: 2,
            activate_upgrade: 0,
            exp_seller: body.exp_seller
        }
        const result = await TaiKhoan.patch(id, user);
        if (result == 0) {
            return res.status(404).end();
        } else {
            return res.json(result).status(200).end();
        }
    })

app.route('/degrade/:userId')
    .patch(async (req, res) => {
        const id = +req.params.userId || 0;
        /*let temptime = new Date(body.ngaysinh)
        temptime.toLocaleDateString('en-GB')
        time = moment(body.ngaysinh).format('DD/MM/YYYY')
        console.log("Time :" + time);
        console.log(body.ngaysinh)*/
        const user = {
            role: 1,
        }
        const result = await TaiKhoan.patch(id, user);
        if (result == 0) {
            return res.status(404).end();
        } else {
            return res.json(result).status(200).end();
        }
    })
app.route('/change-profile-password')
    .patch(async (req, res) => {
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
    })

    .post(async (req, res) => {
        const body = req.body;
        if (body === null || body === 0) {
            return res.status(404).end();
        } else {
            const user_record = await TaiKhoan.findByMail(body.email);
            if (user_record === null || user_record === 0) {
                return res.status(404).end();
            } else {
                var code = randomString();
                const userdetal = {
                    otd_code: code,
                }
                const result = await TaiKhoan.patch(user_record.mataikhoan, userdetal);
                await Email.send(body.email, 'Reset Password', `Mã xác nhận : ${code}`);
                return res.status(200).end();
            }
        }
    })

    .put(async (req, res) => {
        const body = req.body;
        if (body === null || body === 0) {
            return res.status(404).end();
        } else {
            const user_record = await TaiKhoan.findByMail(body.email);
            if (user_record === null || user_record === 0) {
                return res.status(404).end();
            } else {
                if (user_record.otd_code === body.otd_code) {
                    const userReturned = {
                        mataikhoan: user_record.mataikhoan,
                    }
                    return res.json(userReturned).status(200).end();
                } else {
                    return res.status(404).end();
                }
                /*var code = randomString();
                const userdetal = {
                    otd_code: code,
                }
                const result = await TaiKhoan.patch(user_record.mataikhoan, userdetal);
                await Email.send(body.email, 'Reset Password', `Mã xác nhận : ${code}`);
                return res.status(200).end();*/
            }
        }
    })
app.route('/change-password')
    .patch(async (req, res) => {
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
                const salt = bcrypt.genSaltSync(saltRounds);
                var newPassword = bcrypt.hashSync(body.newPassword, salt);
                user.matkhau = newPassword;
                await TaiKhoan.patch(userId, user);
                return res.status(200).end();
            }
        }
    })
    ;

function randomString() {
    var result = '';
    var length = 12;
    var chars = '0123456789';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

module.exports = app;