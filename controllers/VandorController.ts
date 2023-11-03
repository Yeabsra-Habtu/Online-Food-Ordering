import { Request, Response, NextFunction } from "express";
import { EditVandorInput, VandorLoginInput } from "../dto";
import { Food, Order, vandor } from "../models";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVandor } from "./AdminController";
import { CreateFoodInput } from "../dto/Food.dto";

export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInput>req.body;
  const existingVandor = await FindVandor("", email);
  if (existingVandor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVandor.password,
      existingVandor.salt
    );
    if (validation) {
      const signature = await GenerateSignature({
        _id: existingVandor.id,
        email: existingVandor.email,
        name: existingVandor.name,
        foodType: existingVandor.foodType,
      });

      return res.json(signature);
    } else {
      return res.json("password incorrect");
    }
  }
  return res.json("Vandor login failed");
};
export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  console.log(req.user);
  if (user) {
    const existingVandor = await FindVandor(user._id);
    res.json(existingVandor);
  } else {
    res.json("Vandor info not found");
  }
};
export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { foodType, name, address, phone } = <EditVandorInput>req.body;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.name = name;
      existingVandor.address = address;
      existingVandor.phone = phone;
      existingVandor.foodType = foodType;

      const savedVandor = await existingVandor.save();
      return res.json(savedVandor);
    }
    return res.json(existingVandor);
  }
  return res.json("Vandor not found");
};
export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.serviceAvaliable = !existingVandor.serviceAvaliable;
      const savedVandor = await existingVandor.save();
      return res.json(savedVandor);
    }
    return res.json(existingVandor);
  }
  return res.json("Vandor not found");
};
export const UpdateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);

      existingVandor.coverImage.push(...images);
      const result = await existingVandor.save();

      return res.json(result);
    }
  }
};
export const CreateFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { category, description, foodType, name, price, readyTime } = <
      CreateFoodInput
    >req.body;
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);
      const createdFood = await Food.create({
        vandorId: existingVandor._id,
        name: name,
        category: category,
        description: description,
        foodType: foodType,
        price: price,
        readyTime: readyTime,
        image: images,
        rating: 0,
      });
      existingVandor.foods.push(createdFood);
      const result = await existingVandor.save();

      return res.json(result);
    }
  }
};
export const GetFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vandorId: user._id });
    if (foods !== null) {
      res.json(foods);
    } else {
      return res.json("No food found");
    }
  }
};
export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vandorId: user._id }).populate(
      "item.food"
    );
    console.log(orders)
    if (orders !== null) {
      return res.status(200).json(orders);
    }
  }
  return res.json("No order found");
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId=req.params.id
  if(orderId){
    const order=await Order.findById(orderId).populate('item.food')
    const {status,remark,time}=req.body
    if(order){
      order.orderStatus=status
      order.remark=remark
      if(time){
        order.readyTime=time
      }
      const orderResult=await order.save();
      return res.status(200).json(orderResult)
    }
  }
  return res.json("Can't Process Order");

};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate("item.food");
    if (order !== null) {
      return res.status(200).json(order);
    }
  }
  return res.json("No order found");

};
