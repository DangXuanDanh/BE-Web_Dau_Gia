const express = require('express');
const app = new express.Router();
const { Op } = require('sequelize')

const LichSuDauGia = require('../../models/lichsudaugia.model');
const SanPham = require('../../models/sanpham.model');
const DanhMuc = require('../../models/danhmuc.model');
const AnhSanPham = require('../../models/anhsanpham.model');
const TaiKhoan = require('../../models/taikhoan.model');

const Email = require('../../services/mailer');

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


app.route('/find/:id')
    .get(async function (req, res) {
        res.status(200).json(await LichSuDauGia.findOne({
            where: {
                malichsudaugia: req.params.id
            },
            include: [TaiKhoan]
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

app.route('/deny/:mataikhoan/:masanpham')
    .get(async function (req, res) {
        const newlsdg = await LichSuDauGia.findOne({
            where: {
                masanpham: req.params.masanpham,
                mataikhoan: {
                    [Op.ne]: req.params.mataikhoan
                },
            },
            order: [
                ['ngaydaugia', 'DESC']
            ],
            include: [TaiKhoan]
        })

        await SanPham.update({
            malichsucaonhat: newlsdg ? newlsdg.malichsudaugia : undefined
        },
            {
                where: {
                    masanpham: req.params.masanpham,
                },
            })
        await LichSuDauGia.destroy({
            where: {
                masanpham: req.params.masanpham,
                mataikhoan: req.params.mataikhoan,
            }
        })
        const user = await TaiKhoan.findOne({
            where: {
                mataikhoan: req.params.mataikhoan,
            },
        })
        await Email.send(user.email, 'B???n v???a b??? t??? ch???i ?????u gi?? s???n ph???m!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.params.masanpham} ????? xem ngay!`);
        res.status(200).json();
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
            limit: 5,
            where: {
                masanpham: req.params.id
            },
            include: [TaiKhoan]
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
            include: [TaiKhoan]
            // include: SanPham
        });
        res.status(200).json(customers);
    })
    .post(validate(), async function (req, res, next) {
        let user = await TaiKhoan.findOne({
            where: {
                mataikhoan: req.body.mataikhoan
            },
        })
        let noidung = 'Th??nh c??ng'
        let tongdanhgia = user.danhgiatot + user.danhgiaxau
        let bool = tongdanhgia == 0
        let ratio = tongdanhgia > 0 ? user.danhgiatot / tongdanhgia : -1
        if (bool == false) {
            bool = ratio >= 0.8 ? true : false
            noidung = bool ? noidung : 'Kh??ng ????? ??i???m ????nh gi??'
        }

        const oldLSDG = await LichSuDauGia.findOne({
            order: [
                ['ngaydaugia', 'DESC']
            ],
            limit: 1,
            where: {
                masanpham: req.body.masanpham
            }
        });

        const thongtinsanpham = await SanPham.findOne({
            where: {
                masanpham: req.body.masanpham
            },
            include: [DanhMuc, AnhSanPham, TaiKhoan]
        })

        // het han dau gia
        const thoigian = (thongtinsanpham.ngayketthuc - new Date()) / 1000
        if (thoigian <= 0) {
            const result = {
                danhgia: ratio,
                status: false,
                messenger: 'S???n ph???m ???? h???t h???n ?????u gi??'
            }

            res.status(200).json(result);
            return
        }


        let giadat = req.body.gia
        let bool2 = true
        let bool3 = true
        let nguoichienthang = undefined

        // co the mua ngay
        if (parseInt(req.body.gia) >= thongtinsanpham.giamuangay && bool) {
            nguoichienthang = req.body.mataikhoan
            console.log('nguoichienthang ' + nguoichienthang)
            customer = await LichSuDauGia.create({
                masanpham: req.body.masanpham,
                mataikhoan: req.body.mataikhoan,
                gia: thongtinsanpham.giamuangay,
                giacaonhat: thongtinsanpham.giamuangay,
            });
            actor = await SanPham.update({
                malichsucaonhat: customer.malichsudaugia,
                nguoichienthang: nguoichienthang
            },
                {
                    where: {
                        masanpham: req.body.masanpham,
                    },
                });
            await Email.send(thongtinsanpham.taikhoan.email, 'Gi?? c?????c m???i v???a ???????c c???p nh???t!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} ????? xem ngay!`);
            await Email.send(user.email, 'B???n ???? ?????u gi?? th??nh c??ng!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} ????? xem ngay!`);

            if (oldLSDG != undefined) {
                await TaiKhoan.findOne({
                    where: {
                        mataikhoan: oldLSDG.mataikhoan
                    }
                }).then(async (e) => {
                    if (e.email != user.email) {
                        await Email.send(e.email, 'Gi?? c?????c m???i v???a ???????c c???p nh???t!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} ????? xem ngay!`);

                        const result = {
                            danhgia: ratio,
                            status: true,
                            messenger: 'B???n ???? chi???n th???ng ?????u gi?? v???i gi?? mua ngay!'
                        }

                        res.status(200).json(result);
                        return
                    }
                })
            }
        }

        // co nguoi nao dau gia roi hay khong
        if (oldLSDG != undefined) {
            if (parseInt(req.body.gia) < oldLSDG.gia) {
                bool2 = false
            }

            // dau gia tu dong
            if (!oldLSDG.giacaonhat) {
                giadat = oldLSDG.giakhoidiem
            } else {
                if (parseInt(req.body.gia) <= oldLSDG.giacaonhat) {
                    bool3 = false
                    customer = await LichSuDauGia.create({
                        masanpham: req.body.masanpham,
                        mataikhoan: oldLSDG.mataikhoan,
                        gia: req.body.gia,
                        giacaonhat: oldLSDG.giacaonhat,
                    }).then(async (e) => {
                        actor = await SanPham.update({
                            malichsucaonhat: e.malichsudaugia,
                            nguoichienthang: nguoichienthang
                        },
                            {
                                where: {
                                    masanpham: req.body.masanpham,
                                },
                            })


                        if (thongtinsanpham.tudonggiahan) {

                            const thoigian = (thongtinsanpham.ngayketthuc - new Date()) / 1000
                            //5 phut
                            if (thoigian >= 0 && thoigian <= 300) {
                                let ngayketthucnew = thongtinsanpham.ngayketthuc
                                ngayketthucnew.setSeconds(ngayketthucnew.getSeconds() + 300)

                                await SanPham.update({
                                    ngayketthuc: ngayketthucnew,
                                }, {
                                    where: {
                                        masanpham: req.body.masanpham,
                                    },
                                })
                            }
                        }

                        await Email.send(thongtinsanpham.taikhoan.email, 'Gi?? c?????c m???i v???a ???????c c???p nh???t!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} ????? xem ngay!`);
                        const abc = await TaiKhoan.findOne({
                            where: {
                                mataikhoan: oldLSDG.mataikhoan
                            }
                        }).then(async (e) => {
                            await Email.send(e.email, 'Gi?? c?????c m???i v???a ???????c c???p nh???t!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} ????? xem ngay!`);
                        })
                    })

                }
                else {
                    giadat = parseInt(oldLSDG.giacaonhat) + parseInt(thongtinsanpham.buocgia)
                }
            }
        }
        else {
            giadat = parseInt(thongtinsanpham.giakhoidiem) + parseInt(thongtinsanpham.buocgia)
        }

        noidung = bool2 ? noidung : 'Gi?? c?????c kh??ng h???p l??? ' + req.body.gia + ' < ' + oldLSDG.gia
        noidung = bool3 ? noidung : 'C?????c kh??ng th??nh c??ng, ng?????i kh??c ???? ?????t gi?? cao h??n'

        const result = {
            danhgia: ratio,
            status: bool && bool2 && bool3,
            messenger: noidung
        }

        // neu la nguoi dau tien dau gia
        if (bool && bool2 && bool3) {
            console.log("dau gia thanh cong ")
            customer = await LichSuDauGia.create({
                masanpham: req.body.masanpham,
                mataikhoan: req.body.mataikhoan,
                gia: giadat,
                giacaonhat: req.body.gia,
            });
            actor = await SanPham.update({
                malichsucaonhat: customer.malichsudaugia,
                nguoichienthang: nguoichienthang
            },
                {
                    where: {
                        masanpham: req.body.masanpham,
                    },
                });

            // tu dong gia han
            if (thongtinsanpham.tudonggiahan) {

                const thoigian = (thongtinsanpham.ngayketthuc - new Date()) / 1000
                //5 phut
                if (thoigian >= 0 && thoigian <= 300) {
                    let ngayketthucnew = thongtinsanpham.ngayketthuc
                    ngayketthucnew.setSeconds(ngayketthucnew.getSeconds() + 300)

                    await SanPham.update({
                        ngayketthuc: ngayketthucnew,
                    }, {
                        where: {
                            masanpham: req.body.masanpham,
                        },
                    })
                }
            }

            await Email.send(thongtinsanpham.taikhoan.email, 'Gi?? c?????c m???i v???a ???????c c???p nh???t!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} ????? xem ngay!`);
            await Email.send(user.email, 'B???n ???? ?????u gi?? th??nh c??ng!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} ????? xem ngay!`);

            if (oldLSDG != undefined) {
                await TaiKhoan.findOne({
                    where: {
                        mataikhoan: oldLSDG.mataikhoan
                    }
                }).then(async (e) => {
                    if (e.email != user.email) {
                        await Email.send(e.email, 'Gi?? c?????c m???i v???a ???????c c???p nh???t!', `V??o ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} ????? xem ngay!`);
                    }
                })
            }
        }
        res.status(200).json(result);
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