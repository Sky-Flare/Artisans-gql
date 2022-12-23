import { Secret, verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { MyContext, Payload } from '~/graphql/myContext';

// create auth checker function
export const authChecker: AuthChecker<MyContext> = ({ context }, roles) => {
  console.log('authChecker');

  const authorization = context.req.headers['authorization'];
  if (!authorization) {
    throw new Error('Not authenticated');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.JWT_SECRET as Secret) as Payload;

    if (!payload) {
      throw new Error('Not authenticated');
    }

    context.payload = payload;
    const role = payload.role;
    if (roles.length === 0) {
      console.log('roles.length === 0');

      return role !== undefined;
    }
    if (!role) {
      console.log('!role');

      return false;
    }

    // if (user.roles.some(role => roles.includes(role))) {
    if (roles.includes(role)) {
      console.log('roles.includes(role)');

      // grant access if the roles overlap
      return true;
    }
    console.log('authChecker false');
    return false;
  } catch (err) {
    throw new Error('Not authenticated');
  }
};
