import express from "express";
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
  CreateOrder,
  GetAllOrders,
  GetOrderById,
  AddToCart,
GetCart,
DeleteCart
} from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();
//create/signup
router.post("/signup", CustomerSignUp);
//login
router.post("/login", CustomerLogin);
router.use(Authenticate)

//verify
router.patch("/verify", CustomerVerify);
//request OTP
router.get("/otp", RequestOtp);
//profile
router.get("/profile", GetCustomerProfile);
router.patch("/editProfile", EditCustomerProfile);

//cart

router.post('/addToCart', AddToCart);
router.get('/getCart', GetCart)
router.get('/deleteCart', DeleteCart)
//payment

//order
router.post('/createOrder',CreateOrder)
router.get('/allOrders',GetAllOrders)
router.get('/order/:id',GetOrderById)






export { router as CustomerRoute };
