import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import env from '../config/env';
import AppError from '../utils/AppError';
import { SignupPayload, LoginPayload, IUserDocument } from '../types';

/**
 * Generates a signed JWT for a given user ID.
 */
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Register a new user.
 */
const signup = async ({ name, email, password }: SignupPayload) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Authenticate an existing user.
 */
const login = async ({ email, password }: LoginPayload) => {
  const user = await User.findOne({ email }).select('+password') as IUserDocument | null;
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id.toString());

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Get the current authenticated user profile.
 */
const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user.toJSON();
};

export { signup, login, getMe };
