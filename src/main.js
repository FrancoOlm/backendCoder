import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './public/routes/products.router.js';
import cartsRouter from './public/routes/carts.router.js'
import viewsRouter from './public/routes/views.router.js'
import config from './config.js';
import { Server } from 'socket.io';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const socketServer = new Server (httpServer)
app.set('socketServer', socketServer)


socketServer.on('connection', socket =>{
    const idClient = socket.id
    console.log(`Nuevo cliente conectado con ID: ${idClient}`)
    
    socket.emit('clientId', idClient)

    socket.on('newMessage', data =>{
        socketServer.emit('newGeneralMessage', data)
    })
})
