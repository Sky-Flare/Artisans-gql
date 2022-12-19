import { Request, Response } from 'express';
import { Role } from '~/entities/generic/user';

export type Payload = {
  artisanId: string;
  role: Role;
};

export interface MyContext {
  req: Request;
  res: Response;
  payload?: Payload;
}
