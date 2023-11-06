import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {
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

const OfferSchema = new Schema(
  {
    offerType: { type: String, required: true },
    vandors: [{ type: Schema.Types.ObjectId, ref: "Vandor" }],
    title: { type: String, required: true },
    description: { type: String },
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: { type: Date },
    endValidity: { type: Date },
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{ type: String}],
    bins: [{ type: Number}],
    pincode: { type: String },
    isActive: { type: Boolean },
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

const Offer = mongoose.model<OfferDoc>("Offer", OfferSchema);
export { Offer };
