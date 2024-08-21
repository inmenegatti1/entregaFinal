const {Router} = require('express')
const router = Router();
const cartManager = require('../class/CartManager')
const cart =  new cartManager()
const fs = require('fs');



router.get('/:pid',async(req, res )=>{
    const id = parseInt(req.params.pid)
    const data = await cart.buscarCarrinho(id)

    res.send(data)
})


router.post('', async(req, res)=>{
    await cart.criarCarrinho()
    res.status(201).send({ message: 'Carrinho criado com sucesso!' });
})


router.post('/:cid/product/:pid',async(req,res)=>{
    const idCarrinho = parseInt(req.params.cid)
    const idProduto = parseInt(req.params.pid)
    await cart.addProdutoCarrinho(idCarrinho,idProduto)
    res.status(201).send({ message: 'Produto Adicionado com sucesso!' });
})



module.exports = router

