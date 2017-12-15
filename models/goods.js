/**
 * Created by admin on 17/12/11.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
    productId: String,
    productName: String,
    salePrice: Number,
    productImage: String,
    productNum: Number, // 如果没有,添加购物车的时候就不会有这个属性
    checked: Number // 如果没有,添加购物车的时候就不会有这个属性
});
// 定义商品模型
module.exports = mongoose.model('Good', productSchema);