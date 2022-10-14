import { Request, Response } from 'express';

import { Role } from '@entity/user';

export type Payload = {
  userId: string;
  role: Role;
};

export interface MyContext {
  req: Request;
  res: Response;
  payload?: Payload;
}
