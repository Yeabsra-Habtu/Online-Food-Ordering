import { Request, Response, NextFunction } from "express";
import { CreateOfferInput, EditVandorInput, VandorLoginInput } from "../dto";
import { Food, Order, Vandor,Offer } from "../models";
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
export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user
  if (user) {
    const {bank,bins,description,endValidity,isActive,minValue,
    offerAmount,offerType,pincode,promoCode,promoType,startValidity,title}=<CreateOfferInput>req.body
    const vandor=await Vandor.findById(user._id)
    if(vandor){
      const offer=await Offer.create({
        title:title,
        description:description,
        minValue:minValue,
        offerAmount:offerAmount,
        offerType:offerType,
        startValidity:startValidity,
        endValidity:endValidity,
        promoCode:promoCode,
        promoType:promoType,
        bank:bank,
        bins:bins,
        pincode:pincode,
        isActive:isActive,
        vandors:[vandor]
      })
      console.log(offer)
      return res.status(200).json(offer)
    }
  }
  return res.json("Could not create offer. Please try again");

};
export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user=req.user
  if(user){
    let currentOffers=Array();
    const offers=await Offer.find().populate('vandors')
    if(offers){
      offers.map(item=>{
        if(item.vandors){
          item.vandors.map(vandor=>{
            if(vandor._id.toString()===user._id){
              currentOffers.push(item)
            }
          })
        }
        console.log(currentOffers)
        if(item.offerType=="GENERIC"){
          currentOffers.push(item)
        }
      })
    }
    return res.status(200).json(currentOffers)
  }
  return res.json("No Offers Avaliable");

};
export const UpdateOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user=req.user
  const offerId=req.params.id

  if(user){
    const {bank,bins,description,endValidity,isActive,minValue,
      offerAmount,offerType,pincode,promoCode,promoType,startValidity,title}=<CreateOfferInput>req.body
      const currentOffers=await Offer.findById(offerId);
      if(currentOffers){
        const vandor=await FindVandor(user._id)
        if (vandor){
          currentOffers.title=title;
          currentOffers.description=description;
          currentOffers.minValue=minValue;
          currentOffers.offerAmount=offerAmount;
          currentOffers.offerType=offerType;
          currentOffers.startValidity=startValidity;
          currentOffers.endValidity=endValidity;
          currentOffers.promoCode=promoCode;
          currentOffers.promoType=promoType;
          currentOffers.bank=bank;
          currentOffers.bins=bins;
          currentOffers.pincode=pincode;
          currentOffers.isActive=isActive;
          const updatedOffer=await currentOffers.save();
          return res.status(200).json(updatedOffer)
        }
      }
  }

};