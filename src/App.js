const express = require('express');
const productManagerRouter = require('./routes/productManager.route')
const cartManagerRouter = require('./routes/cartManager.route')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const routerPadraoProdutos = '/api/products'
const routerPadraoCart = '/api/carts'

app.use(routerPadraoProdutos, productManagerRouter)
app.use(routerPadraoCart, cartManagerRouter)



module.exports = app