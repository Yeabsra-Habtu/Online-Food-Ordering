import express from 'express'
import {GetVandorProfile, UpdateVandorProfile, UpdateVandorService, VandorLogin } from '../controllers';
import { Authenticate } from '../middleware';

const router=express.Router();

router.post('/vandorLogin',VandorLogin)
router.get('/profile',Authenticate,GetVandorProfile)
router.patch('/profileUpdate',Authenticate,UpdateVandorProfile)
router.patch('/serviceAvaliableUpdate',Authenticate,UpdateVandorService)
export{router as VanorRoute}