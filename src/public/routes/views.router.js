import { Router } from 'express';
import { ProductManager } from '../../fileSystem.js';
import path, { dirname } from 'path';
import config from '../../config.js';

const router = Router();
const FILEPATH = path.join(config.BASE_PATH, 'src', 'db', 'productsDb.json');
console.log('Ruta del archivo:', FILEPATH); // Para depuración
const productManager = new ProductManager(FILEPATH);

router.get('/index', async (req, res) => {
    try{
        const allProducts = await productManager.getProducts()
        console.log(allProducts)
        res.status(200).render('index', {products: allProducts} );
    } catch (error){
        console.log(error)
        res.status(500).render('index', {error: 'Error al obtener los productos'})
    }
});

router.get ('/realtime', (req, res) => {
    res.render('realTimeProducts');
});

export default router;