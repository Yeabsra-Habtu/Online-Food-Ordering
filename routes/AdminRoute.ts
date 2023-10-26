import express from 'express'
import { CreateVander, GetVandor, GetVandorById } from '../controllers';

const router=express.Router();

router.post('/createVandor',CreateVander)
router.get('/getVandor',GetVandor)
router.get('/getVandorById/:id',GetVandorById)
export{router as AdminRoute}