import express,{Request,Response,NextFunction} from 'express'
import {plainToClass}from 'class-transformer'
import {validate} from 'class-validator'
import { CreateCustomerInputs, CustomerLoginInput, EditCustomerProfileInput } from '../dto/Customer.dto'
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, SendOtp, ValidatePassword } from '../utility'
import { Customer } from '../models'

export const CustomerSignUp=async(req:Request,res:Response,next:NextFunction)=>{
    const customerInputs=plainToClass(CreateCustomerInputs,req.body)
    const inputErrors=await validate(customerInputs,{validationError:{target:true}})

    if(inputErrors.length>0){
        res.status(400).json(inputErrors)
    }
    const {email,phone,password}=customerInputs
    const salt=await GenerateSalt();
    const newPassword=await GeneratePassword(password,salt)
    const {otp,expiry}=await GenerateOtp();

    const existingCustomer=await Customer.findOne({email:email})
    if(existingCustomer !== null){
        return res.json({message:'Customer already exists with the provided email'})
    }
    const result=await Customer.create({
        email:email,
        phone:phone,
        password:newPassword,
        salt:salt,
        otp:otp,
        otp_expiry:expiry,
        firstName:'',
        lastName:'',
        verified:false,
        lat:0,
        lng:0,
    })

    if(result){
        await SendOtp(otp,phone)

        const signature=await GenerateSignature({
            _id:result._id,
            email:result.email,
            verified:result.verified
        })
        return res.status(201).json({signature:signature,email:result.email,verified:result.verified})

    }else{
        return res.status(500).json({message:"Error on signup"})
    }
    
}
export const CustomerLogin=async(req:Request,res:Response,next:NextFunction)=>{
    const customerInputs=plainToClass(CustomerLoginInput,req.body)
    const inputErrors=await validate(customerInputs,{validationError:{target:false}})

    if(inputErrors.length>0){
        res.status(400).json(inputErrors)
    }

    const {email,password}=customerInputs
    const customer=await Customer.findOne({email:email})

    if(customer){
        const validation=await ValidatePassword(password,customer.password,customer.salt)
        if(validation){
            const signature=await GenerateSignature({
                _id:customer._id,
                email:customer.email,
                verified:customer.verified,
            })

            return res.status(201).json({
                signature:signature,
                email:customer.email,
                verifeid:customer.verified,
            })
        }
    }
    res.status(500).json('Login error')
}
export const CustomerVerify=async(req:Request,res:Response,next:NextFunction)=>{
    const {otp}=req.body
    const customer=req.user
    console.log(customer)
    if(customer){
        const profile=await Customer.findById(customer._id)
        if(profile){
            if(profile.otp===parseInt(otp)&&profile.otp_expiry>=new Date()){
                profile.verified=true

                const updatedCustomerResponse=await profile.save();

                const signature=await GenerateSignature({
                    _id:updatedCustomerResponse._id,
                    email:updatedCustomerResponse.email,
                    verified:updatedCustomerResponse.verified
                })

                return res.status(200).json({
                    signature:signature,
                    email:updatedCustomerResponse.email,
                    verified:updatedCustomerResponse.verified,
                })
            }
        }
    }else{
        return res.status(500).json({message:"Error on otp verification"})
    }
    

}
export const RequestOtp=async(req:Request,res:Response,next:NextFunction)=>{
    const customer=req.user
    if(customer){
        const profile=await Customer.findById(customer._id)
        if(profile){
            const {otp,expiry}=await GenerateOtp()
            profile.otp=otp,
            profile.otp_expiry=expiry,

            await profile.save()
            await SendOtp(otp,profile.phone)
            return res.status(500).json({message:"OTP sent to registerd phone number"})

        }
    }
    return res.status(500).json({message:"Error while requestin otp"})

}
export const GetCustomerProfile=async(req:Request,res:Response,next:NextFunction)=>{
    const customer=req.user
    if(customer){
        const profile=await Customer.findById(customer._id)
        if(profile){
            res.status(200).json(profile)
        }
    }
    return res.status(500).json({message:"Error while getting customer profile"})

}
export const EditCustomerProfile=async(req:Request,res:Response,next:NextFunction)=>{
    const customer=req.user
    const profileInputs=await plainToClass(EditCustomerProfileInput,req.body)
        const inputErrors=await validate(profileInputs,{validationError:{target:false}})
    
        if(inputErrors.length>0){
            res.status(400).json(inputErrors)
        }
        const {firstName,lastName,address}=profileInputs
    if(customer){
        const profile=await Customer.findById(customer._id)
        if(profile){
            profile.firstName=firstName,
            profile.lastName=lastName,
            profile.address=address

            const result=await profile.save();
            res.status(201).json(result)
        }
    }
}