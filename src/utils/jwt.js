import jwt from 'jsonwebtoken';
import { loggers } from 'winston';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const jwttoken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      loggers.error('Failed to authenticate the token', error);
      throw new Error('Failed to authenticate the token');
    }
  },

  verify: token => {
    try {
      try {
        return jwt.verify(token, JWT_SECRET);
      } catch (error) {
        loggers.error('Failed to authenticate the token', error);
        throw new Error('Failed to authenticate the token');
      }
    } catch (error) {
      loggers.error('Failed to verify the token', error);
      throw new Error('Failed to verify the token');
    }
  },
};
