import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateCustomerInputs,
  CustomerLoginInput,
  EditCustomerProfileInput,
  OrderInput,
} from "../dto/Customer.dto";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  SendOtp,
  ValidatePassword,
} from "../utility";
import { Customer, Food, Order } from "../models";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerInputs = plainToClass(CreateCustomerInputs, req.body);
    const inputErrors = await validate(customerInputs, {
      validationError: { target: true },
    });

    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = customerInputs;
    const salt = await GenerateSalt();
    const newPassword = await GeneratePassword(password, salt);
    const { otp, expiry } = await GenerateOtp();

    const existingCustomer = await Customer.findOne({ email: email });

    if (existingCustomer !== null) {
      return res
        .status(400)
        .json({ message: "Customer already exists with the provided email" });
    }

    const result = await Customer.create({
      email: email,
      phone: phone,
      password: newPassword,
      salt: salt,
      otp: otp,
      otp_expiry: expiry,
      firstName: "",
      lastName: "",
      verified: false,
      lat: 0,
      lng: 0,
      orders: [],
    });

    if (result) {
      await SendOtp(otp, phone);

      const signature = await GenerateSignature({
        _id: result._id,
        email: result.email,
        verified: result.verified,
      });

      return res.status(201).json({
        signature: signature,
        email: result.email,
        verified: result.verified,
      });
    } else {
      return res.status(500).json({ message: "Error on signup" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CustomerLoginInput, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: false },
  });

  if (inputErrors.length > 0) {
    res.status(400).json(inputErrors);
  }


  const { email, password } = customerInputs;
  const customer = await Customer.findOne({ email: email });
  console.log(customerInputs)
  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );
    if (validation) {
      const signature = await GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(201).json({
        signature: signature,
        email: customer.email,
        verifeid: customer.verified,
      });
    }
  }
  res.status(500).json("Login error");
};
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;
  console.log(customer);
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        const signature = await GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });

        return res.status(200).json({
          signature: signature,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });
      }
    }
  } else {
    return res.status(500).json({ message: "Error on otp verification" });
  }
};
export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      const { otp, expiry } = await GenerateOtp();
      (profile.otp = otp), (profile.otp_expiry = expiry), await profile.save();
      await SendOtp(otp, profile.phone);
      return res
        .status(500)
        .json({ message: "OTP sent to registerd phone number" });
    }
  }
  return res.status(500).json({ message: "Error while requestin otp" });
};
export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      res.status(200).json(profile);
    }
  }
  return res
    .status(500)
    .json({ message: "Error while getting customer profile" });
};
export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const profileInputs = await plainToClass(EditCustomerProfileInput, req.body);
  const inputErrors = await validate(profileInputs, {
    validationError: { target: false },
  });

  if (inputErrors.length > 0) {
    res.status(400).json(inputErrors);
  }
  const { firstName, lastName, address } = profileInputs;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      (profile.firstName = firstName),
        (profile.lastName = lastName),
        (profile.address = address);

      const result = await profile.save();
      res.status(201).json(result);
    }
  }
};

//cart
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    
    if(customer){

        const profile = await Customer.findById(customer._id);
        let cartItems = Array();

        const { _id, unit } = <OrderInput>req.body;

        const food = await Food.findById(_id);

        if(food){

            if(profile != null){
                cartItems = profile.cart;

                if(cartItems.length > 0){
                    // check and update
                    let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
                    if(existFoodItems.length > 0){
                        
                        const index = cartItems.indexOf(existFoodItems[0]);
                        
                        if(unit > 0){
                            cartItems[index] = { food, unit };
                        }else{
                            cartItems.splice(index, 1);
                        }

                    }else{
                        cartItems.push({ food, unit})
                    }

                }else{
                    // add new Item
                    cartItems.push({ food, unit });
                }

                if(cartItems){
                    profile.cart = cartItems as any;
                    const cartResult = await profile.save();
                    return res.status(200).json(cartResult.cart);
                }

            }
        }

    }

    return res.status(404).json({ msg: 'Unable to add to cart!'});
}

export const GetAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
};
export const GetCartById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
};
//orders
export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
    const profile = await Customer.findById(customer._id);

    const cart = <[OrderInput]>req.body;

    let cartItems = Array();

    let netAmount = 0.0;

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    if (cartItems) {
      const currentOrder = await Order.create({
        orderID: orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD",
        paymentResponse: "",
        orderStatus: "waiting",
      });
      if (currentOrder) {
        profile?.orders.push(currentOrder);
        await profile?.save();
        return res.status(200).json(currentOrder);
      }
    }
  }
  return res.status(400).json({ message: "Error while creating order" });
};

export const GetAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");
    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }
};

export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate("item.food");
    return res.status(200).json(order);
  }
};
