const AnhSanPham = require('./anhsanpham.model');
const LichSuDauGia = require('./lichsudaugia.model');
const SanPham = require('./sanpham.model');
const DanhMuc = require('./danhmuc.model');
const TaiKhoan = require('./taikhoan.model');


SanPham.hasMany(LichSuDauGia)
LichSuDauGia.belongsTo(SanPham,{foreignKey: 'masanpham'})

SanPham.hasMany(AnhSanPham)
AnhSanPham.belongsTo(SanPham,{foreignKey: 'masanpham'})

DanhMuc.hasMany(SanPham)
SanPham.belongsTo(DanhMuc,{foreignKey: 'madanhmuc'})

// TaiKhoan.hasMany(SanPham)
// SanPham.belongsTo(TaiKhoan,{foreignKey: 'manguoidang'})


// DanhMuc.hasMany(DanhMuc)
// DanhMuc.belongsTo(DanhMuc,{foreignKey: 'madanhmuccha'})

