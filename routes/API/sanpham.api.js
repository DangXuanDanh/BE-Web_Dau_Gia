const express = require('express');
const app = new express.Router();
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const SanPham = require('../../models/sanpham.model');
const DanhMuc = require('../../models/danhmuc.model');
const AnhSanPham = require('../../models/anhsanpham.model');
const TaiKhoan = require('../../models/taikhoan.model');
const LichSuDauGia = require('../../models/lichsudaugia.model');
const url = require('url');

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
        let sp = await SanPham.findOne({
            where: {
                masanpham: req.params.id
            },
            // raw: true,
            // nest: true,
            include: [DanhMuc, AnhSanPham, TaiKhoan]
        })
        sp = sp.toJSON()
        sp.thoigian = sp.ngayketthuc - new Date()
        res.status(200).json(sp);
    })
    .delete(async function (req, res, next) {
        actor = await SanPham.destroy({
            where: {
                masanpham: req.params.id,
            },
        });
        res.status(204).json(actor);
    })

app.route('/done/:manguoidang')
    .get(async function (req, res) {
        let sp = await SanPham.selectRawQuery('SELECT * FROM sanpham join lichsudaugia on sanpham.malichsucaonhat = lichsudaugia.malichsudaugia where manguoidang = :manguoidang and (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is not null)', { ngayketthuc: new Date(), manguoidang: req.params.manguoidang })

        res.status(200).json(sp);
    })

app.route('/')
    .all(async function (req, res, next) {
        next()
    })
    .get(async function (req, res, next) {
        actors = await SanPham.findAll({
            order: [
                ['ngaydang', 'DESC']
            ],
            where: {
                ngayketthuc: {
                    [Op.gte]: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                is_delete: 0
            }
        });
        res.status(200).json(actors);
    })
    .post(validate(), async function (req, res, next) {

        actor = await SanPham.create({
            tensanpham: req.body.tensanpham,
            mota: req.body.mota,
            madanhmuc: req.body.madanhmuc,
            maanhdaidien: req.body.maanhdaidien,
            giakhoidiem: req.body.giakhoidiem,
            giamuangay: req.body.giamuangay,
            buocgia: req.body.buocgia,
            tudonggiahan: req.body.tudonggiahan,
            ngayketthuc: req.body.ngayketthuc,
            manguoidang: req.body.manguoidang
        });
        res.status(200).json(actor);
    })
    .put(validate(), async function (req, res, next) {

        actor = await SanPham.update({
            tensanpham: req.body.tensanpham,
            mota: req.body.mota,
            madanhmuc: req.body.madanhmuc,
            anhdaidien: req.body.anhdaidien,
            giakhoidiem: req.body.giakhoidiem,
            giamuangay: req.body.giamuangay,
            buocgia: req.body.buocgia,
            tudonggiahan: req.body.tudonggiahan,
            ngayketthuc: req.body.ngayketthuc,
            is_delete: req.body.is_delete
        },
            {
                where: {
                    masanpham: req.body.masanpham,
                },
            });
        res.json(actor);
    })

//lấy sản phẩm của người bán
app.route('/detail/:userId')
    .get(async function (req, res, next) {
        actors = await SanPham.findAll({
            order: [
                ['ngaydang', 'DESC']
            ],
            where: {
                manguoidang: req.params.userId,
                ngayketthuc: {
                    [Op.gte]: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                is_delete: 0
            }
        });
        res.status(200).json(actors);
    })

//5 San pham co gia cao nhat
app.route('/get/MaxPrice').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery('SELECT * FROM sanpham where (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is null)  order by giamuangay desc LIMIT :limit', { limit: 5, ngayketthuc: new Date() })
    res.status(200).json(sp);
})
//5 San pham moi nhat
app.route('/get/New').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery('SELECT * FROM sanpham where (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is null) order by ngaydang desc LIMIT :limit', { limit: 5, ngayketthuc: new Date() })
    res.status(200).json(sp);
})

//5 San pham moi nhat cung danh muc
app.route('/get/New/:sanpham/:danhmuc').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery('SELECT * FROM sanpham where masanpham != :sanpham and madanhmuc = :danhmuc and (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is null) order by ngaydang desc LIMIT :limit', { limit: 5, sanpham: req.params.sanpham, danhmuc: req.params.danhmuc, ngayketthuc: new Date() })
    res.status(200).json(sp);
})

//5 San pham moi nhat cung danh muc cha va con
app.route('/get/New/:danhmuc').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery('SELECT * FROM sanpham s join danhmuc d on s.madanhmuc = d.madanhmuc where d.madanhmuc = :danhmuc or d.madanhmuccha = :danhmuc and (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is null) order by ngaydang desc LIMIT :limit', { limit: 5, danhmuc: req.params.danhmuc, ngayketthuc: new Date() })
    res.status(200).json(sp);
})

//5 San pham gan ket thuc    
app.route('/get/NearEnd').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery(`SELECT * FROM sanpham 
    WHERE (interval '0 days')<=age(ngayketthuc,CURRENT_TIMESTAMP) and age(ngayketthuc,CURRENT_TIMESTAMP)<=(interval '14 days') and (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is null)
    LIMIT :limit`, { limit: 5, ngayketthuc: new Date() })
    res.status(200).json(sp);
})
//Tim kiem san pham theo ten
app.route('/get/Name').get(async function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    let sql = `SELECT (select count(masanpham) from sanpham WHERE lower(tensanpham) like :name) as sl,* FROM sanpham 
    WHERE lower(tensanpham) like :name and (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is null)`;
    (queryObject.orderType) ? sql += " order by " + queryObject.orderType : sql += "";
    (queryObject.orderBy) ? sql += " desc" : sql += "";
    sql += ` LIMIT 8 OFFSET :offset`
    let sp = await SanPham.selectRawQuery(sql, { name: "%" + queryObject.name + "%", offset: (queryObject.page - 1) * 8, ngayketthuc: new Date() })
    res.status(200).json(sp);
})
app.route('/get/Count').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery(`SELECT * FROM sanpham where (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is null)
    order by luot_ra_gia_hien_tai desc
    LIMIT :limit`, { limit: 5, ngayketthuc: new Date() })
    res.status(200).json(sp);
})
// Lay san pham theo danh muc
app.route('/get/category/:id').get(async function (req, res) {
    let sp = await SanPham.selectRawQuery(`SELECT * FROM sanpham 
    WHERE madanhmuc=:id and (sanpham.ngayketthuc < :ngayketthuc or sanpham.nguoichienthang is null)`, { id: req.params.id, ngayketthuc: new Date() })
    res.status(200).json(sp);
})
module.exports = app;