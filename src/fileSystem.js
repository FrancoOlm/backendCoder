import {
    isUtf8
} from 'buffer';
import fs from 'fs'


export class ProductManager {
    constructor(file) {
        this.file = file;
    }
    async init() {
        try {
            const exists = await fs.promises.access(this.file);
            console.log('El archivo existe');
        } catch (err) {
            console.log('El archivo NO existe');
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    async #readProductFile() {
        const product = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(product);
    }

    async createProduct(data) {
        const products = await this.#readProductFile();
    const lastId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    const newProduct = { ...data, id: lastId + 1 };
    products.push(newProduct);
    await fs.promises.writeFile(this.file, JSON.stringify(products));
    console.log('Producto agregado con ID:', newProduct.id);
    return newProduct;
/*         const product = await this.#readProductFile();
        product.push(data); */

        await fs.promises.writeFile(this.file, JSON.stringify(product));
        console.log('Producto agregado');
    }
    async updateProduct(data, id) {
        const allProducts = await this.#readProductFile();
        let index = allProducts.findIndex(element => element.id === id)
        if (index > -1) {

            if (data.title != "") {
                allProducts[index].title = data.title
            }
            if (data.category != "") {
                allProducts[index].category = data.category
            }
            if (data.description != "") {
                allProducts[index].description = data.description
            }
            if (data.code != "") {
                allProducts[index].code = data.code
            }
            if (data.price != "") {
                allProducts[index].price = data.price
            }
            if (data.stock != "") {
                allProducts[index].stock = data.stock
            }
        }
        await fs.promises.writeFile(this.file, JSON.stringify(allProducts));
        console.log('Producto actualizado');
    }

    async deleteProduct(id) {
        console.log('Iniciando eliminación del producto con ID:', id);
        if (typeof id !== 'number' || isNaN(id)) {
            console.error('ID inválido proporcionado para eliminar producto:', id);
            throw new Error('ID de producto inválido');
        }
        const products = await this.#readProductFile();
        const productToDelete = products.find(product => product.id === id);
        if (!productToDelete) {
            console.error('Producto no encontrado con ID:', id);
            throw new Error('Producto no encontrado');
        }
        const updatedProducts = products.filter(product => product.id !== id);
        await fs.promises.writeFile(this.file, JSON.stringify(updatedProducts));
        console.log(`Producto con ID ${id} eliminado`);
        /* const products = await this.#readProductFile();
        
        const updatedProducts = products.filter(element => element.id !== id);
        
        await fs.promises.writeFile(this.file, JSON.stringify(updatedProducts));
        
        console.log(`Producto con ID ${id} eliminado`); */

    }

    async createCart() {
        const allCarts = await this.#readProductFile();
        const maxId = Math.max(...allCarts.map(element => +element.id));
        const newCart = {
            id: maxId + 1,
            products: []
        };
        allCarts.push(newCart)
        await fs.promises.writeFile(this.file, JSON.stringify(allCarts));
    }

    async addProductToCart(product, allCarts, cartId) {
        let indexCart = allCarts.findIndex(element => element.id === cartId)
        let indexProduct = allCarts[indexCart].products.findIndex(element => element.id === product.id)

        if (indexProduct == '') {

            allCarts[indexCart].products[indexProduct].quantity++
            await fs.promises.writeFile(this.file, JSON.stringify(allCarts));
            return
        }

        let newProduct = {
            id: product.id,
            quantity: 1,
            title: product.title
        }
        allCarts[indexCart].products.push(newProduct)
        await fs.promises.writeFile(this.file, JSON.stringify(allCarts));
        return
    }

    async updateProduct(data, id) {
        const allProducts = await this.#readProductFile();
        let index = allProducts.findIndex(element => element.id === id)
        if (index > -1) {

            if (data.title != "") {
                allProducts[index].title = data.title
            }
            if (data.category != "") {
                allProducts[index].category = data.category
            }
            if (data.description != "") {
                allProducts[index].description = data.description
            }
        }
        await fs.promises.writeFile(this.file, JSON.stringify(allProducts));
        console.log('Producto actualizado');
    }

    async getProducts() {
        return await this.#readProductFile();
    }
}