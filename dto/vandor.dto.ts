export interface CreateVandorInput{
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
}

export interface EditVandorInput{
    name:string;
    address:string;
    phone:string;
    foodType:[string];
}
export interface VandorLoginInput{
    email:string;
    password:string;
}

export interface VandorPayloadInput{
    _id:string;
    email:string;
    name:string;
    foodType:string[];
}

export interface CreateOfferInput{
    offerType: string;
    vandors:[any];
    title: string;
    description: string;
    minValue: number;
    offerAmount: number;
    startValidity:Date;
    endValidity:Date;
    promoCode: string;
    promoType: string;
    bank:[string];
    bins:[number];
    pincode:string;
    isActive: boolean;
}