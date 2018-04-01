import mongoose from 'mongoose';

const Schema = mongoose.Schema;


let GMSchema = new Schema({
    username: String,
    password: String,
    loginBaseCookie: Array,
    submitOrderCookie: Array
});

const GM = mongoose.model('GM', GMSchema);

export default GM;