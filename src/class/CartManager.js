const fs = require('fs');
const ProductManager = require('./../class/ProductManager');
const productManager = new ProductManager()

class CartManager {
    constructor() {
        this.path = './cart.json';
        this.arrayCarrinho = [];
    }
    async lerArquivo() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.arrayProdutos = JSON.parse(data);
            return this.arrayProdutos;
        } catch (error) {
            console.log('Arquivo não existente ou vazio, criando um novo...');
            return [];
        }
    }

    async salvarArquivo(arrayProdutos){
      try {
          await fs.promises.writeFile(this.path, JSON.stringify(arrayProdutos));
      } catch (error) {
          
      }
  }

    async getProductId(id) {
        this.arrayProdutos = await this.lerArquivo();
        const encontrarProduto = this.arrayProdutos.find(produto => produto.id === id);
        return encontrarProduto;
    }

    async buscarItensArrayId(id){
        this.arrayCarrinho = await this.lerArquivo()
        const idEncontrado =  this.arrayCarrinho.find((carrinho)  => carrinho.id === id)
        return idEncontrado
    }

    async buscarCarrinho(id){
        this.arrayCarrinho = await this.lerArquivo()
        const data = this.arrayCarrinho.find(carrinho=>carrinho.id == id)
        return data.arrayProdutos
    }
    

    async criarCarrinho(){
      let novoId = 0
      this.arrayCarrinho = await this.lerArquivo()
      if(this.arrayCarrinho.length > 0 ){
         const ultimoProduto = this.arrayCarrinho[this.arrayCarrinho.length - 1];
         novoId = ultimoProduto.id + 1;
      }else{
         novoId = 1
      }
      
      const carrinho = {
         id: novoId,
         arrayProdutos: [{
            id:[],
            qtd: 0
         }],
      }

      this.arrayCarrinho.push(carrinho)
      this.salvarArquivo(this.arrayCarrinho)
      

    }
    

    async encontrarIndice(id){
        this.arrayCarrinho = await this.lerArquivo();
        const indiceEncontrado = this.arrayCarrinho.findIndex((carrinho) => carrinho.id === id);
        return indiceEncontrado
    }

    

    async addProdutoCarrinho(idCarrinho, idProduto) {
        const idEncontrado = await this.buscarItensArrayId(idCarrinho);
        const indiceEncontrado = await this.encontrarIndice(idCarrinho);
    
        if (idEncontrado) {
            if (indiceEncontrado >= 0) {
                const produtoEncontrado = await productManager.getProductId(idProduto);
                this.arrayCarrinho = await this.lerArquivo();
    
                const indexCarrinho = this.arrayCarrinho.findIndex(carrinho => carrinho.id === idCarrinho);
    
                if (indexCarrinho >= 0) {
                    const indexArrayObjProduto = this.arrayCarrinho[indexCarrinho].arrayProdutos.findIndex(produto =>
                        produto.id.includes(idProduto)
                    );
    
                    if (indexArrayObjProduto >= 0) {
                        this.arrayCarrinho[indexCarrinho].arrayProdutos[indexArrayObjProduto].qtd += 1;
                    } else {
                        this.arrayCarrinho[indexCarrinho].arrayProdutos.push({
                            id: [idProduto],
                            qtd: 1
                        });
                    }
    
                    await this.salvarArquivo(this.arrayCarrinho);
                }
            }
        }
    }
}

module.exports =  CartManager



