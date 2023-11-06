import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
    cutomer:string;
    vandorId:string;
    orderId:string;
    orderValue:number;
    offerUsed:string;
    status:string;
    paymentMode:string;
    paymentResponse:string;
}

const TransactionSchema = new Schema(
  {
    customer:{type:String},
    vandorId:{type:String},
    orderId:{type:String},
    orderValue:{type:Number},
    offerUsed:{type:String},
    status:{type:String},
    paymentMode:{type:String},
    paymentResponse:{type:String}
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Transaction = mongoose.model<TransactionDoc>("Transaction", TransactionSchema);
export { Transaction };
