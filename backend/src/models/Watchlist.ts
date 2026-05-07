import mongoose, { Schema, Model } from 'mongoose';
import { IWatchlistDocument } from '../types';

const watchlistItemSchema = new Schema<IWatchlistDocument>(
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
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent duplicate symbols per user
watchlistItemSchema.index({ user: 1, symbol: 1 }, { unique: true });

const WatchlistItem: Model<IWatchlistDocument> = mongoose.model<IWatchlistDocument>('WatchlistItem', watchlistItemSchema);

export default WatchlistItem;
