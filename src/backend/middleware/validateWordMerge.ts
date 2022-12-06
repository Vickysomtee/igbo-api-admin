import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { findGenericWordById } from '../controllers/genericWords';
import { findWordSuggestionById } from '../controllers/wordSuggestions';

const { Types } = mongoose;
const wordMergeDataSchema = Joi.object().keys({
  id: Joi.string().external(async (value) => {
    if (value && !Types.ObjectId.isValid(value)) {
      throw new Error('Invalid original word id provided');
    }
    return true;
  }),
});

export default async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  const { body: finalData, user, mongooseConnection } = req;
  const suggestionDoc: any = ((await findWordSuggestionById(finalData.id, mongooseConnection))
  || (await findGenericWordById(finalData.id)));
  req.suggestionDoc = suggestionDoc;

  if (!user || (user && !user.uid)) {
    res.status(400);
    return res.send(new Error('User uid is required'));
  }

  try {
    await wordMergeDataSchema.validateAsync(finalData, { abortEarly: false });
    return next();
  } catch (err) {
    res.status(400);
    if (err.details) {
      const errorMessage = err.details.map(({ message }) => message).join('. ');
      return res.send({ message: errorMessage });
    }
    return res.send({ message: err.message });
  }
};
