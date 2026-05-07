import Joi from 'joi';

export const addHoldingSchema = Joi.object({
  symbol: Joi.string().trim().uppercase().min(1).max(10).required().messages({
    'any.required': 'Stock symbol is required',
  }),
  companyName: Joi.string().trim().allow('').max(200).optional().default(''),
  quantity: Joi.number().positive().precision(4).required().messages({
    'number.positive': 'Quantity must be greater than zero',
    'any.required': 'Quantity is required',
  }),
  averagePrice: Joi.number().min(0).precision(2).required().messages({
    'number.min': 'Average price cannot be negative',
    'any.required': 'Average purchase price is required',
  }),
});
