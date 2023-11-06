import express from 'express'
import { GetFoodAvaliablity, GetFoodsIn30Min, GetResturantById, GetTopResturants, SearchFoods,GetAvailableOffers } from '../controllers';

const router=express.Router();

//food avaliablity
router.get('/:pincode',GetFoodAvaliablity)
//top resturant
router.get('/top-resturnats/:pincode',GetTopResturants)
//food availiabl in 30 mins
router.get('/food-in-30-min/:pincode',GetFoodsIn30Min)
//search food
router.get('/search-food/:pincode',SearchFoods)
//get offers
router.get('/getOffers/:pincode',GetAvailableOffers)
//search resturant by id
router.get('/resturnat-by-id/:id',GetResturantById)
export{router as ShoppingRoute}