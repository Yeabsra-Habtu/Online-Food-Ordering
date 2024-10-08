import mongoose,{Schema,Document}from 'mongoose';

interface VandorDoc extends Document{
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    salt:string;
    serviceAvaliable:boolean;
    coverImage:[string];
    rating:number;
    foods:any,
    lat:number,
    lng:number
}

const VandorSchema=new Schema({
    name:{type:String, required:true},
    ownerName:{type:String, required:true},
    foodType:[String],
    pincode:{type:String, required:true},
    address:{type:String},
    phone:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    salt:{type:String, required:true},
    serviceAvaliable:{type:Boolean},
    coverImage:[String],
    rating:{type:Number},
    foods:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Food'
    }],
    lat:{type:Number},
    lng:{type:Number}
},{
    toJSON:{
        transform(doc,ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps:true
})

const Vandor = mongoose.model<VandorDoc>('Vandor',VandorSchema);
export{Vandor}