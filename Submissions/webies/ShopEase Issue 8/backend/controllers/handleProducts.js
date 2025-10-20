const Product = require('../models/product')

async function addProducts(req, res) {
    const newProduct = await Product.create(req.body)
    return res.status(201).json({ msg: "product added", newProduct })
}

async function deleteProduct(req, res) {
    const deleteById = req.params.id
    await Product.findByIdAndDelete(deleteById)
    return res.json({ msg: "product deleted" })
}

async function editProduct(req, res) {
    const editById = req.params.id
    const edited = await Product.findByIdAndUpdate(editById, req.body)
    return res.json({ msg: "product being updated" })
}
async function showProducts(req, res) {
    const products = await Product.find({})
    return res.status(201).json(products)
}

async function showOneProduct(req, res) {
    const id = req.params.id
    const product = await Product.findById(id)
    return res.json(product)
}

module.exports = {
    addProducts,
    showProducts,
    deleteProduct,
    editProduct,
    showOneProduct
}