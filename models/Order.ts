import mongoose, { Schema, Document, mongo } from "mongoose";

export interface OrderDoc extends Document {
  orderID: string;
  vandorId: string;
  items: [any];
  totalAmount: number;
  paidAmount:number;
  orderDate: Date;

  orderStatus: string;
  remark: string;
  deliveryId: string;

  readyTime: number;
}

const OrderSchema = new Schema(
  {
    orderID: { type: String, required: true },
    vandorId:{type:String, required:true},
    item: [
      {
        food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    orderDate: { type: Date },
    orderStatus: { type: String },
    remark: { type: String },
    deliveryId: { type: String },
    readyTime: { type: Number },
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

const Order = mongoose.model<OrderDoc>("Order", OrderSchema);
export { Order };
