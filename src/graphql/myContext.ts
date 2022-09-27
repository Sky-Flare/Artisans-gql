import { Request, Response } from 'express';
import { Role } from '../entities/user';

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string; role: Role };
}
