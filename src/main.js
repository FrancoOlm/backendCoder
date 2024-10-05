import express from 'express';
import productsRouter from './public/routes/products.router.js';
import cartsRouter from './public/routes/carts.router.js'

const PORT = 8080
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const midd1 = (req, res, next) => {
    console.log('Se recibió una solicitud general');
    next();
}
app.use(midd1);

app.use('/api/products/' , productsRouter)
app.use('/api/carts/' , cartsRouter)





app.listen(PORT, ()=>{
    console.log(`Servidor abierto en puerto ${PORT}`)
})