const {Router} = require('express')
const router = Router();
const ProductManager = require('./../class/ProductManager');
const productManager = new ProductManager()



router.get('', async(req, res)=>{
    let limite = parseInt(req.query.limit)
   try {
    if(limite > 0){
        const data = await productManager.filtrarQtdProduto(limite)
        res.send(data)
    }else{
        const data = await productManager.lerArquivo()
        res.send(data)
    }
   } catch (error) {
    
   }
 })

 router.get('/:pid', async (req,res)=>{
    const id = parseInt(req.params.pid)
    const produtoEncontrado = await productManager.getProductId(id)
    res.send(produtoEncontrado)
})

let arrayProdutos = []
router.post('', async(req, res)=>{
    const produto = req.body
    if(!produto.status){
        produto.status = true
    }
    const produtoAprovadoCampos = productManager.verificarCamposObrigatorios(produto)
    if(produtoAprovadoCampos){
        produto.thumbnails = []
        arrayProdutos.push(produto)
        productManager.addProduct(produto)
        res.send({status:'sucesso', message: 'produto adicionado'})
    }
})


router.put('/:pid', async(req, res) =>{
    const id = parseInt(req.params.pid)
    const produto = req.body
    productManager.updateProducts(id, produto)
    res.send({ status: 'sucesso', message: 'Produto atualizado' });
})


router.delete('/:pid', async(req, res) =>{
    const id = parseInt(req.params.pid)
    productManager.deleteProduct(id)
} )


module.exports = router
