import { Secret, verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';

import { MyContext, Payload } from '@src/graphql/myContext';
import { Role } from '@entity/generic/user';

// create auth checker function
export const authChecker: AuthChecker<MyContext> = (MyContext, roles) => {
  const authorization = MyContext.context.req.headers['authorization'];
  if (!authorization) {
    throw new Error('Not authenticated');
  }

  try {
    const token = authorization;
    const payload = verify(token, process.env.JWT_SECRET as Secret) as Payload;

    if (!payload) {
      throw new Error('Not authenticated');
    }

    MyContext.context.payload = payload;
    const role = payload.role;
    if (roles.length === 0) {
      return role !== undefined;
    }
    if (!role) {
      return false;
    }

    if (
      roles.includes(Role.OWNER) &&
      roles.includes(payload.role) &&
      MyContext.root?.id === payload.userId
    ) {
      return true;
    } else if (roles.includes(Role.OWNER)) {
      throw new Error('Not owner');
    }
    // if (user.roles.some(role => roles.includes(role))) {
    if (roles.includes(role)) {
      // grant access if the roles overlap
      return true;
    }
    return false;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throw new Error(err.message);
  }
};
