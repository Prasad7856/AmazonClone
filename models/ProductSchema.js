const mongoose = require('mongoose');

const ProductScehema = new mongoose.Schema({
    id:String,
    url:String,
    detailUrl:String,
    title:Object,
    price:Object,
    description:String,
    discount:String,
    tagline:String,
})

const Products = new mongoose.model("products",ProductScehema);

module.exports = Products;
