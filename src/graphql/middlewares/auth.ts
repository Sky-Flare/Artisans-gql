import { MiddlewareFn, AuthChecker } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { MyContext } from '../myContext';

// create auth checker function
export const authChecker: AuthChecker<MyContext> = ({ context }, roles) => {
  const authorization = context.req.headers['authorization'];
  if (!authorization) {
    throw new Error('Not authenticated');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.JWT_SECRET);

    context.payload = payload as any;
    const role = payload.role;
    if (roles.length === 0) {
      return role !== undefined;
    }
    if (!role) {
      return false;
    }

    // if (user.roles.some(role => roles.includes(role))) {
    if (roles.includes(role)) {
      // grant access if the roles overlap
      return true;
    }

    return false;
  } catch (err) {
    throw new Error('Not authenticated');
  }
};
