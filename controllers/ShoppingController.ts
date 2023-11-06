import express, { Request, Response, NextFunction } from "express";
import { FoodDoc, Offer, Vandor } from "../models";

export const GetFoodAvaliablity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;
  const result = await Vandor
    .find({ pincode: pincode, serviceAvaliable: false })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json("No Data Found");
  }
};
export const GetTopResturants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;
  const result = await Vandor
    .find({ pincode: pincode, serviceAvaliable: false })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json("No Data Found");
  }
};
export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;
  const result = await Vandor
    .find({ pincode: pincode, serviceAvaliable: false })
    .populate("foods");

  if (result.length > 0) {
    let foodResults: any = [];
    result.map((vandor) => {
      const foods = vandor.foods as [FoodDoc];
      foodResults.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.status(200).json(foodResults);
  } else {
    return res.status(400).json("No Data Found");
  }
};
export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;
  const result = await Vandor
    .find({ pincode: pincode, serviceAvaliable: false })
    .populate("foods");

  if (result.length > 0) {
    let foodResults: any = [];
    result.map((item) => {
      foodResults.push(...item.foods);
    });
    return res.status(200).json(foodResults);
  } else {
    return res.status(400).json("No Data Found");
  }
};
export const GetAvailableOffers=async(req:Request,res:Response,next:NextFunction)=>{
  const pincode=req.params.pincode
  if(pincode){
    const offer=await Offer.find({pincode:pincode, isActive:true})
    if(offer){
      return res.status(200).json(offer)
    }
  }
  return res.status(400).json("No Data Found");

};
export const GetResturantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { id } = req.params;
  const result = await Vandor
    .findById(id)
    .populate("foods");

  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json("No Data Found");
  }
};
