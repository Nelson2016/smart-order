import mongoose from 'mongoose';

const Schema = mongoose.Schema;


let GMProductSchema = new Schema({
    pid: String,
    sid: String,
    productName: String,
    price: Number,
    status: Number,//default 0 ; 0=正常 ; 1=合并下单
    step: Number//default 0 ; 0=正常 ; 1=购物车中
});

const GMProduct = mongoose.model('GMProduct', GMProductSchema);

export default GMProduct;