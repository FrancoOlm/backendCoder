import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './public/routes/products.router.js';
import cartsRouter from './public/routes/carts.router.js'
import viewsRouter from './public/routes/views.router.js'
import { ProductManager } from './fileSystem.js';
import config from './config.js';
import path from 'path';
import { Server } from 'socket.io';


const app = express();
const FILEPATH = path.join(config.BASE_PATH, 'src', 'db', 'productsDb.json');
const productManager = new ProductManager(FILEPATH);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Config de express y handle
app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use('/static', express.static(`${config.DIRNAME}/public`));


const midd1 = (req, res, next) => {
    //console.log('Se recibió una solicitud general');
    next();
}
app.use(midd1);

app.use('/api/products/' , productsRouter)
app.use('/api/carts/' , cartsRouter)
app.use('/views', viewsRouter);

const httpServer= app.listen(config.PORT, ()=>{
    console.log(`Servidor abierto en puerto ${config.PORT}`)
})


const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar la lista de productos al cliente cuando se conecta
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);

    // Escuchar el evento de nuevo producto
    socket.on('addProduct', async (product) => {
        await productManager.createProduct(product);
        const updatedProducts = await productManager.getProducts();
        socketServer.emit('updateProducts', updatedProducts);
    });

    // Escuchar el evento de eliminar producto
    socket.on('deleteProduct', async (productId) => {
        console.log('Intentando eliminar producto con ID:', productId); // Para depuración
        if (typeof productId === 'number' && !isNaN(productId)) {
            await productManager.deleteProduct(productId);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } else {
            console.error('ID de producto inválido:', productId);
        }
    });



});