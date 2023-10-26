import { Request, Response, NextFunction } from "express";
import { CreateVandorInput, EditVandorInput, VandorLoginInput } from "../dto";
import { vandor } from "../models";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";
import { FindVandor } from "./AdminController";



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
        const signature=await GenerateSignature({
            _id:existingVandor.id,
            email:existingVandor.email,
            name:existingVandor.name,
            foodType:existingVandor.foodType,
        })

      return res.json(signature);
    } else {
      return res.json("password incorrect");
    }
  }
  return res.json("Vandor login failed");
};

export const GetVandorProfile=async(req:Request,res:Response,next:NextFunction)=>{
    const user=req.user
    console.log(req.user)
    if(user){
      const existingVandor=await FindVandor(user._id)
      res.json(existingVandor)
    }else{
      res.json('Vandor info not found')
    }
}
export const UpdateVandorProfile=async(req:Request,res:Response,next:NextFunction)=>{
  const user=req.user
  const {foodType,name,address,phone}=<EditVandorInput>req.body
  if(user){
    const existingVandor=await FindVandor(user._id)
    if(existingVandor !== null){
      existingVandor.name=name
      existingVandor.address=address
      existingVandor.phone=phone
      existingVandor.foodType=foodType

      const savedVandor=await existingVandor.save();
      return res.json(savedVandor)
    }
    return res.json(existingVandor)
  }
  return res.json("Vandor not found")
}
export const UpdateVandorService=async(req:Request,res:Response,next:NextFunction)=>{
  const user=req.user
  if(user){
    const existingVandor=await FindVandor(user._id)
    if(existingVandor !== null){
      existingVandor.serviceAvaliable=!existingVandor.serviceAvaliable
      const savedVandor=await existingVandor.save();
      return res.json(savedVandor)
    }
    return res.json(existingVandor)
  }
  return res.json("Vandor not found")
}
