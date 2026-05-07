import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── Extended Express Request ────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: IUserDocument;
}

// ─── User ────────────────────────────────────────────────────────────
export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Watchlist ───────────────────────────────────────────────────────
export interface IWatchlistItem {
  user: Types.ObjectId;
  symbol: string;
  companyName: string;
  addedAt: Date;
}

export interface IWatchlistDocument extends IWatchlistItem, Document {
  _id: Types.ObjectId;
}

// ─── Holding / Portfolio ─────────────────────────────────────────────
export interface IHolding {
  user: Types.ObjectId;
  symbol: string;
  companyName: string;
  quantity: number;
  averagePrice: number;
}

export interface IHoldingDocument extends IHolding, Document {
  _id: Types.ObjectId;
  investedValue: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── JWT ─────────────────────────────────────────────────────────────
export interface JwtPayload {
  id: string;
}

// ─── Auth Payloads ───────────────────────────────────────────────────
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Stock Search Result ─────────────────────────────────────────────
export interface StockSearchResult {
  symbol: string;
  companyName: string;
  sector: string;
  logo: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap: number;
  exchange: string;
  volume: number | null;
}
