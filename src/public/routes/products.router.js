import { Router } from 'express';
import { ProductManager } from '../../fileSystem.js';

const router = Router();
const FILEPATH=  'src/db/productsDb.json'
const fileSystem = new ProductManager(FILEPATH)


router.get('/' , async (req,res)=>{
    try {
        const allProducts = await fileSystem.getProducts()
        res.status(200).send({ error: null, data: allProducts });
    } catch (error) {
        console.log(error)
    }
    
    
})

router.get('/:pid', async (req, res) => {
    try {
        const allProducts = await fileSystem.getProducts()
        const { pid } = req.params;
        const product = allProducts.find(element => element.id === parseInt(pid));
        if (!product == '') {
            res.json(product);
        } else {
            res.status(404).send({ message: "Product not found " });
        }
    } catch (error) {
        
    }
});

router.post('/', async (req, res) => { 
    const{title , description, code, price, status = true, stock , category, thumbnails} =req.body
    try {
        const allProducts = await fileSystem.getProducts()

        if (title !='' && description !='' && code !='' && price !='' && status !='' && stock !='' && category !=''&& thumbnails !='')  {

            const maxId = Math.max(...allProducts.map(element => +element.id));

            const newProduct = { id: maxId + 1, title: title, description: description, code: code, price:price, status:status, stock:stock, category:category, thumbnails:thumbnails };

            res.status(200).send({ error: null, data: newProduct});
            fileSystem.createProduct(newProduct)
            
        } else {
            res.status(400).send({ error: 'Faltan campos obligatorios', data: [] });
        }
    } catch (error) {
        console.log(error)
    }

});

router.put ('/:pid', async (req,res)=>{
    const ID = parseInt(req.params.pid);
    fileSystem.updateProduct(req.body,ID)
        res.status(200).send({error: null, data: "Datos cambiados correctamente"})

}) 

router.delete ('/:pid', async (req,res)=>{
    const ID = parseInt(req.params.pid);
    fileSystem.deleteProduct(ID)
        res.status(200).send({error: null, data: "Producto eliminado correctamente"})

}) 
export default router
