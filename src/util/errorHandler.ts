import { Request, Response, NextFunction } from 'express';
import config from '../config';

interface Error {
  message: string;
  name: string;
  stack?: number;
  status?: number;
}

export default (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (!err) next();
  config.logger.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
};
