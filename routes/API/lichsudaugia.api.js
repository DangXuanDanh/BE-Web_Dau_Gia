const express = require('express');
const app = new express.Router();

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


app.route('/:id')
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
        let noidung = 'Thành công'
        let tongdanhgia = user.danhgiatot + user.danhgiaxau
        let bool = tongdanhgia == 0
        let ratio = tongdanhgia > 0 ? user.danhgiatot / tongdanhgia : -1
        if (bool == false) {
            bool = ratio >= 0.8 ? true : false
            noidung = bool ? noidung : 'Không đủ điểm đánh giá'
        }

        const sanpham = await LichSuDauGia.findOne({
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

        const thoigian = (thongtinsanpham.ngayketthuc - new Date()) / 1000
        if (thoigian <= 0){
            const result = {
                danhgia: ratio,
                status: false,
                messenger: 'Sản phẩm đã hết hạn đấu giá'
            }
    
            res.status(200).json(result);
            return
        }


        let giadat = req.body.gia
        let bool2 = true
        let bool3 = true
        let nguoichienthang = undefined

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
            await Email.send(thongtinsanpham.taikhoan.email, 'Giá cược mới vừa được cập nhật!', `Vào ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} để xem ngay!`);
            await Email.send(user.email, 'Bạn đã đấu giá thành công!', `Vào ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} để xem ngay!`);

            if (sanpham != undefined) {
                await TaiKhoan.findOne({
                    where: {
                        mataikhoan: sanpham.mataikhoan
                    }
                }).then(async (e) => {
                    if (e.email != user.email) {
                        await Email.send(e.email, 'Giá cược mới vừa được cập nhật!', `Vào ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} để xem ngay!`);

                        const result = {
                            danhgia: ratio,
                            status: true,
                            messenger: 'Bạn đã chiến thắng đấu giá với giá mua ngay!'
                        }

                        res.status(200).json(result);
                    }
                })
            }

            if (sanpham != undefined) {
                if (parseInt(req.body.gia) < sanpham.gia) {
                    bool2 = false
                }


                if (!sanpham.giacaonhat) {
                    giadat = sanpham.giakhoidiem
                } else {
                    if (parseInt(req.body.gia) <= sanpham.giacaonhat) {
                        bool3 = false
                        customer = await LichSuDauGia.create({
                            masanpham: req.body.masanpham,
                            mataikhoan: sanpham.mataikhoan,
                            gia: req.body.gia,
                            giacaonhat: sanpham.giacaonhat,
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

                            await Email.send(thongtinsanpham.taikhoan.email, 'Giá cược mới vừa được cập nhật!', `Vào ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} để xem ngay!`);
                            const abc = await TaiKhoan.findOne({
                                where: {
                                    mataikhoan: sanpham.mataikhoan
                                }
                            }).then(async (e) => {
                                await Email.send(e.email, 'Giá cược mới vừa được cập nhật!', `Vào ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} để xem ngay!`);
                            })
                        })

                    }
                    else {
                        giadat = parseInt(sanpham.giacaonhat) + parseInt(thongtinsanpham.buocgia)
                    }
                }
            }
        }
        noidung = bool2 ? noidung : 'Giá cược không hợp lệ ' + req.body.gia + ' < ' + sanpham.gia
        noidung = bool3 ? noidung : 'Cược không thành công, người khác đã đặt giá cao hơn'

        const result = {
            danhgia: ratio,
            status: bool && bool2 && bool3,
            messenger: noidung
        }

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

            await Email.send(thongtinsanpham.taikhoan.email, 'Giá cược mới vừa được cập nhật!', `Vào ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} để xem ngay!`);
            await Email.send(user.email, 'Bạn đã đấu giá thành công!', `Vào ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} để xem ngay!`);

            if (sanpham != undefined) {
                await TaiKhoan.findOne({
                    where: {
                        mataikhoan: sanpham.mataikhoan
                    }
                }).then(async (e) => {
                    if (e.email != user.email) {
                        await Email.send(e.email, 'Giá cược mới vừa được cập nhật!', `Vào ${process.env.BASE_URL || 'http://localhost:5000'}/detail?id=${req.body.masanpham} để xem ngay!`);
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