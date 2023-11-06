import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email: email });
  } else {
    return await Vandor.findById(id);
  }
};
export const CreateVander = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    pincode,
    address,
    email,
    foodType,
    password,
    phone,
  } = <CreateVandorInput>req.body;
  const existingVandor = await FindVandor("", email);
  if (existingVandor !== null) {
    return res.json("Vandor already exists with this email");
  }
  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);
  const createdVandor = await Vandor.create({
    name: name,
    ownerName: ownerName,
    pincode: pincode,
    address: address,
    salt: salt,
    rating: 2,
    coverImage: [],
    serviceAvaliable: false,
    phone: phone,
    email: email,
    foodType: foodType,
    password: userPassword,
    foods:[],
    lat:0,
    lng:0,
  });
  return res.json(createdVandor);
};
export const GetVandor = async (req: Request, res: Response, next: NextFunction) => {

  const vendors = await Vandor.find()

  if(vendors !== null){
      return res.json(vendors)
  }

  return res.json({"message": "Vendors data not available"})
  

}
export const GetVandorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandorId = req.params.id;
  const vandor = await FindVandor(vandorId);
  if (vandor !== null) {
    return res.json(vandor);
  }
  return res.json("Vandor not found");
};



