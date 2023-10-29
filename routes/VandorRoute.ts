import express from 'express'
import {CreateFood, GetFood, GetVandorProfile, UpdateVandorCoverImage, UpdateVandorProfile, UpdateVandorService, VandorLogin } from '../controllers';
import { Authenticate } from '../middleware';
import multer from "multer";
import fs from 'fs'



const router=express.Router();

const imageStorage=multer.diskStorage({
    destination: 'images',
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const images=multer({storage:imageStorage})
router.post('/vandorLogin',VandorLogin)
router.use(Authenticate)
router.get('/profile',GetVandorProfile)
router.patch('/profileUpdate',UpdateVandorProfile)
router.patch('/serviceAvaliableUpdate',UpdateVandorService)
router.patch('/coverImageUpdate',images.array('images',10),UpdateVandorCoverImage)

router.post('/createFood',images.array('images',10),CreateFood)
router.get('/getFood',GetFood)
export{router as VanorRoute}