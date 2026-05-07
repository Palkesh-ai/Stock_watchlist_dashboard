import mongoose, { Schema, Model } from 'mongoose';
import { IHoldingDocument } from '../types';

const holdingSchema = new Schema<IHoldingDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.0001, 'Quantity must be greater than zero'],
    },
    averagePrice: {
      type: Number,
      required: [true, 'Average purchase price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual: total invested value for this holding
holdingSchema.virtual('investedValue').get(function (this: IHoldingDocument) {
  return +(this.quantity * this.averagePrice).toFixed(2);
});

const Holding: Model<IHoldingDocument> = mongoose.model<IHoldingDocument>('Holding', holdingSchema);

export default Holding;
