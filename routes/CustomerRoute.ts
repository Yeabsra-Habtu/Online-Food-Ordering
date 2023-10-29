import express from "express";
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
} from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();
router.use(Authenticate)
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
router.patch("/editProfile", EditCustomerProfile);
export { router as CustomerRoute };
