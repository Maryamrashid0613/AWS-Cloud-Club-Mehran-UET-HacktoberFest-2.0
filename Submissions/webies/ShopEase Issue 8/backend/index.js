
const express = require('express')
const cors = require("cors")
require('dotenv').config()
const bodyParser=require('body-parser')
const productsRouter= require('./routes/product')
const userRouter=require('./routes/user')
const { connectMongoDb } = require('./connection');
const SalesRouter = require('./routes/sale')
const app = express()

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);

//     next();
// })


const PORT = process.env.PORT || 8001

const mongo_url=process.env.MONGODB_URL
connectMongoDb(mongo_url)
.then(()=>console.log("mongodb connected"))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors('*'))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send('im running')
})

app.use('/auth',userRouter)

app.use('/api/products',productsRouter)
app.use('/api/sales',SalesRouter)

app.listen(PORT,()=>console.log("server started"))
