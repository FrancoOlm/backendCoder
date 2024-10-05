import { Router } from 'express';
import { ProductManager } from '../../fileSystem.js';

const router = Router();
const FILEPATH=  'src/db/productsDb.json'
const FILEPATHCARTS= 'src/db/carts.json'
const productManager = new ProductManager(FILEPATH)
const cartManager = new ProductManager(FILEPATHCARTS)



router.get('/:cid', async (req, res) => {
    try {
        const cid =parseInt(req.params.cid)
        let allCarts  =await cartManager.getProducts()
        let cart =  allCarts.find(element =>element.id === cid)
        console.log(cart)

        if(cart){
        res.status(200).send({cart});
        
        }else{
            res.status(404).send({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).send(error, "Error al obtener el carrito");
    }
});


router.post('/', async (req, res) => {
    try {
        console.log('todo ok')
        cartManager.createCart()
        res.status(200).send( console.log('todo ok'));

        
    } catch (error) {
        res.status(500).send({error: error, data: "Faltan campos "});
        
    }

});
router.post('/:cid/product/:pid', async (req,res)=>{
    const productID = parseInt(req.params.pid);
    const cartID = parseInt(req.params.cid);

    try {
        let allProduct = await productManager.getProducts()
        let allCart = await cartManager.getProducts()

        let indexCart = allCart.findIndex(element => element.id === cartID)
        let indexProduct = allProduct.findIndex(element => element.id === productID)

        if(indexCart.lenght === 0 || indexProduct.lenght ===0){
            res.status(404).send("El ID no existe")
            return
        }
        cartManager.addProductToCart(allProduct[indexProduct],allCart, cartID)
            res.status(200).send({error: null, data: "Datos cargados correctamente"})
        
    } catch (error) {
        res.status(400).send({error: error, data: ""})
        
    }


}) 
export default router

