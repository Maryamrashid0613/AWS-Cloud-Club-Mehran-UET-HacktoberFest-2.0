const mongoose = require('mongoose')

const addProduct = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    category:{
     type:String,
     required:true
    },
    SKU: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
    },
    
})



const Product = mongoose.model("Product", addProduct)

module.exports=Product;