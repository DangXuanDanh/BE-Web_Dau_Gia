const AnhSanPham = require('./anhsanpham.model');
const LichSuDauGia = require('./lichsudaugia.model');
const SanPham = require('./sanpham.model');


SanPham.hasMany(LichSuDauGia)
LichSuDauGia.belongsTo(SanPham,{foreignKey: 'masanpham'})

SanPham.hasMany(AnhSanPham)
AnhSanPham.belongsTo(SanPham,{foreignKey: 'masanpham'})