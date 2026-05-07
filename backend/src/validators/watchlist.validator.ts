import Joi from 'joi';

export const addToWatchlistSchema = Joi.object({
  symbol: Joi.string().trim().uppercase().min(1).max(10).required().messages({
    'any.required': 'Stock symbol is required',
    'string.max': 'Symbol cannot exceed 10 characters',
  }),
  companyName: Joi.string().trim().max(200).optional().default(''),
});
