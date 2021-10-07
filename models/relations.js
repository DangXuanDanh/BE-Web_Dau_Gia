const AnhSanPham = require('./anhsanpham.model');
const LichSuDauGia = require('./lichsudaugia.model');
const SanPham = require('./sanpham.model');
const DanhMuc = require('./danhmuc.model');


SanPham.hasMany(LichSuDauGia)
LichSuDauGia.belongsTo(SanPham,{foreignKey: 'masanpham'})

SanPham.hasMany(AnhSanPham)
AnhSanPham.belongsTo(SanPham,{foreignKey: 'masanpham'})

DanhMuc.hasMany(SanPham)
SanPham.belongsTo(DanhMuc,{foreignKey: 'madanhmuc'})

// DanhMuc.hasMany(DanhMuc)
// DanhMuc.belongsTo(DanhMuc,{foreignKey: 'madanhmuccha'})

