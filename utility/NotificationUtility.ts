//email

//notification

//OTP
export const GenerateOtp=()=>{
    const otp=Math.floor(100000+Math.random()*900000)
    let expiry=new Date();
    expiry.setTime(new Date().getTime()+(30*60*1000))
    return {otp,expiry}
}

export const SendOtp=async (otp:Number,toPhoneNumber:String)=>{
    const accountSid="AC3dde231b4bcb91c05e96fd8f786bf07c";
    const authToken="e6b48115c5afdf302480940a17a920de";

    const client=require('twilio')(accountSid,authToken)

    const response=await client.messages.create({
        body:`Your OTP is ${otp}`,
        from:"+19143689285",
        to:`+251${toPhoneNumber}`
    })
    return response
}
//payment