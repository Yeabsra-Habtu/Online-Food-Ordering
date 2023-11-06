import express from 'express'
import {CreateFood, GetFood, GetVandorProfile, UpdateVandorCoverImage, UpdateVandorProfile, UpdateVandorService, VandorLogin,GetCurrentOrders,ProcessOrder,GetOrderDetails, GetOffers, AddOffer,UpdateOffer } from '../controllers';
import { Authenticate } from '../middleware';
import multer from "multer";



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

//order
router.get('/getOrders',GetCurrentOrders)
router.patch('/processOrder/:id/process',ProcessOrder)
router.get('/getOrder/:id',GetOrderDetails)

//offer
router.get('/getOffers',GetOffers)
router.post('/addOffer',AddOffer)
router.put('/updateOffer/:id',UpdateOffer)

router.post('/createFood',images.array('images',10),CreateFood)
router.get('/getFood',GetFood)
export{router as VanorRoute}