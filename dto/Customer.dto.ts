import {IsEmail,IsEmpty,Length}from 'class-validator'

export class CreateCustomerInputs{

    @IsEmail()
    email:string;

    @Length(7,12)
    phone:string;

    @Length(6,12)
    password:string;
}
export class EditCustomerProfileInput{
    
  @Length(3,12)
  firstName:string;

  @Length(3,12)
  lastName:string;

  @Length(6,12)
  address:string
}
export class CustomerLoginInput{

    @IsEmail()
    email:string;

    @Length(6,12)
    password:string;
}

export interface CustomerPayloadInput{
    _id:string;
    email:string;
    verified:boolean;
}

export class CartItem{
    _id:string;
    unit:number;
}
export class OrderInput{
    txnId:string;
    amount:string;
    items:[CartItem];
}

