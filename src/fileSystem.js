import { isUtf8 } from 'buffer';
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
        const users = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(users);
    }

    async createProduct(data) {
        const product = await this.#readProductFile();
        product.push(data);

        await fs.promises.writeFile(this.file, JSON.stringify(product));
        console.log('Producto agregado');
    }
    async updateProduct(data, id) {
        const allProducts = await this.#readProductFile();
        let index = allProducts.findIndex(element => element.id === id)
        if(index > -1) {

            if(data.title !=""){
                allProducts [index].title =data.title
            }
            if(data.category !=""){
                allProducts [index].category =data.category
            }
            if(data.description !=""){
                allProducts [index].description =data.description
            }
            if(data.code !=""){
                allProducts [index].code =data.code
            }
            if(data.price !=""){
                allProducts [index].price =data.price
            }
            if(data.stock !=""){
                allProducts [index].stock =data.stock
            }
        }
        await fs.promises.writeFile(this.file, JSON.stringify(allProducts));
        console.log('Producto actualizado');
    }

    async deleteProduct(id) {
        const products = await this.#readProductFile();
        
        const updatedProducts = products.filter(element => element.id !== id);
        
        await fs.promises.writeFile(this.file, JSON.stringify(updatedProducts));
        
        console.log(`Producto con ID ${id} eliminado`);
    }
    
    async getProducts() {
        return await this.#readProductFile();
    }
}
