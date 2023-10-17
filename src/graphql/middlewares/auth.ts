import { Secret, verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';

import { MyContext, Payload } from '@src/graphql/myContext';
import { Role } from '@entity/generic/user';

// create auth checker function
export const authChecker: AuthChecker<MyContext> = (MyContext, roles) => {
  console.log('TEST', JSON.stringify(MyContext.info));
  console.log('ROLES', roles);
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
      console.log('roles.length, ', role !== undefined);
      return role !== undefined;
    }
    if (!role) {
      console.log('   if (!role) {', role);
      return false;
    }
    const test = MyContext.root?.id;
    console.log('test', test);
    console.log('roles.includes(Role.OWNER)', roles.includes(Role.OWNER));
    console.log(
      'MyContext.root?.id !== payload.userId',
      MyContext.root?.id !== payload.userId
    );
    console.log('MyContext.root?.id', MyContext.root?.id);
    console.log('payload.userId', payload.userId);
    console.log(' roles.includes(payload.role)', roles.includes(payload.role));
    if (
      roles.includes(Role.OWNER) &&
      roles.includes(payload.role) &&
      MyContext.root?.id === payload.userId
    ) {
      console.log(
        'if ',
        roles.includes(Role.OWNER) &&
          roles.includes(payload.role) &&
          MyContext.root?.id === payload.userId
      );
      return true;
    } else if (roles.includes(Role.OWNER)) {
      console.log('throw');
      throw new Error('Not owner');
    }
    // if (user.roles.some(role => roles.includes(role))) {
    if (roles.includes(role)) {
      // grant access if the roles overlap
      return true;
    }
    console.log('END false');
    return false;
  } catch (err) {
    console.log('catch', err);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throw new Error(err.message);
  }
};
