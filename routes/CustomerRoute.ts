import express from "express";
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
} from "../controllers";

const router = express.Router();

//create/signup
router.post("/signup", CustomerSignUp);
//login
router.post("/login", CustomerLogin);
//verify
router.patch("/verify", CustomerVerify);
//request OTP
router.get("/otp", RequestOtp);
//profile
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);
export { router as CustomerRoute };
