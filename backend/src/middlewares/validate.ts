import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../utils/AppError';

/**
 * Creates a middleware that validates req.body against a Joi schema.
 */
const validate = (schema: Joi.ObjectSchema) => (req: Request, _res: Response, next: NextFunction): void => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join('. ');
    throw new AppError(message, 400);
  }

  req.body = value; // use sanitized values
  next();
};

export default validate;
