import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    const data ={
        name:"pepe"
    }
    res.status(200).render('index', data );
});


export default router;