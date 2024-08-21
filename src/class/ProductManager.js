const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = './produtos.json'; 
        this.arrayProdutos = [];
    }

    verificarCamposObrigatorios(objProduto) {
        if (!objProduto.title || !objProduto.description || !objProduto.price || !objProduto.code || !objProduto.stock) {
            throw new Error("Todos os campos são obrigatórios");
        }
        return objProduto;
    }

    async verificarDuplicidadeCode(codigoProduto) {
        this.arrayProdutos = await this.lerArquivo()
        const produtoEncontradoCodigo = this.arrayProdutos.find((produto) => produto.code === codigoProduto);
        
        if (produtoEncontradoCodigo) {
            throw new Error("Código já existente no produto: " + produtoEncontradoCodigo.code + " " + produtoEncontradoCodigo.title );
        }
        return true;
    }

    async lerArquivo() {
        try {
            this.arrayProdutos = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(this.arrayProdutos);
        } catch (error) {
            console.log('Arquivo não existente');
            return [];
        }
    }


    async addProduct(objProduto) {
        try {
            const camposVerificadosProdutos = this.verificarCamposObrigatorios(objProduto);
            const verificarCodeDuplicado = this.verificarDuplicidadeCode(objProduto.code);

            if (camposVerificadosProdutos && verificarCodeDuplicado) {
                try {
                    this.arrayProdutos = await this.lerArquivo();
                } catch (error) {
                    console.log('Erro ao ler arquivo:', error);
                }
                if(this.arrayProdutos.length > 0){
                    const tamanhoArray = this.arrayProdutos.length
                    const ultimoId = this.arrayProdutos[tamanhoArray - 1].id
                    objProduto.id = ultimoId + 1
                    this.arrayProdutos.push(objProduto);
                }else{
                    objProduto.id = 1
                    this.arrayProdutos.push(objProduto);
                }
                
                await this.salvarArquivo(this.arrayProdutos)
                console.log('Produto adicionado com sucesso');
            }
        } catch (error) {
            console.log('Erro ao adicionar produto:', error.message);
        }
    }

    async salvarArquivo(arrayProdutos){
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(arrayProdutos));
        } catch (error) {
            
        }
    }

   async getProducts(){
        this.arrayProdutos = await this.lerArquivo()
        console.log(this.arrayProdutos)
    }

    async getProductId(id){
        this.arrayProdutos = await this.lerArquivo()
        const encontrarProduto =  this.arrayProdutos.find((produtos)=> produtos.id === id)
        return encontrarProduto
    }

    async verificarUltimoId(){
        try {
            let data = await this.lerArquivo()
            console.log( data[data.length].id)
        } catch (error) {
            
        }
    }

    async updateProducts(id, objProduto){
        try {
            this.arrayProdutos = await this.lerArquivo()
            const indexProduto = this.arrayProdutos.findIndex((produto) => produto.id === id)
            if(indexProduto >=0 ){
                const idProduto = this.arrayProdutos[indexProduto].id
                objProduto.id = idProduto
                this.arrayProdutos[indexProduto] = objProduto
                this.salvarArquivo(this.arrayProdutos)

            }else{
                console.log('Nao existe produto com esse id')
            }
        } catch (error) {
            
        }
    }

    async deleteProduct(id){
        try {
            this.arrayProdutos = await this.lerArquivo()
            const novoArrayItemExcluido = await this.arrayProdutos.filter(objeto => objeto.id !== id)
            if(novoArrayItemExcluido){
                this.salvarArquivo(novoArrayItemExcluido)
                console.log(novoArrayItemExcluido)   
            }else{
                console.log('nao encontrado um produto com esse id para deletar')
            }
        } catch (error) {
            
        }
        
    }

    async filtrarQtdProduto(qtd){
        const data = await this.lerArquivo()
        this.arrayProdutos = data
       return  this.arrayProdutos.slice(0, qtd)

    }
}
module.exports =  ProductManager


    const productManager = new ProductManager();

    const novoProduto = {
        title: 'Exemplo',
        description: 'Exemplo',
        price: 100,
        code: 'teste',
        stock: 10
    };
    const novoProduto2 = {
        title: 'Exemplo',
        description: 'Exemplo',
        price: 100,
        code: 'sasa',
        stock: 10
    };

    const editado = {
        title: 'editado',
        description: 'editado',
        price: 100,
        code: 'editado',
        stock: 10
    };

    async function criarTeste(){
        await productManager.addProduct(novoProduto)
        await productManager.addProduct(novoProduto2)
    }
   
    // criarTeste()
    // productManager.getProductId(1)
    // productManager.getProducts()
    //productManager.updateProducts(1, editado)
   // productManager.deleteProduct(1)




