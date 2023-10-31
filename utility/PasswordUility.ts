import bcrypt from 'bcrypt';
import jwt, { sign } from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config';
import { Request } from 'express';
import { AuthPayloadInput } from '../dto/Auth.dto';
import '../middleware';


export const GenerateSalt=async()=>{
    return await bcrypt.genSalt();
}

export const GeneratePassword=async(password:string,salt:string)=>{
    return await bcrypt.hash(password,salt);
}

export const ValidatePassword=async(enterdPassword:string,savedPassword:string,salt:string)=>{
    return await GeneratePassword(enterdPassword,salt)===savedPassword
}

export const GenerateSignature=async(payload:AuthPayloadInput)=>{
    return jwt.sign(payload,TOKEN_SECRET,{expiresIn:'1d'})
}

export const ValidateSignature=async(req:Request)=>{
    const signature=req.get('Authorization')
    if(signature){
        const payload=await jwt.verify(signature.split(' ')[1],TOKEN_SECRET) as AuthPayloadInput
        req.user=payload
        
        return true; 
    }
    return false;
}