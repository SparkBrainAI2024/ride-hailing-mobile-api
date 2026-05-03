// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { GqlExecutionContext } from '@nestjs/graphql';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const roles = this.reflector.get<string[]>('roles', context.getHandler());
//     if (!roles) {
//       return true;
//     }
//     const ctx = GqlExecutionContext.create(context);
//     const user = ctx.getContext().req.user;
//     const roleTocheck = user.role || user.currentRole;
//     return this.matchRoles(roles, roleTocheck);
//   }

//   private matchRoles(roles: string[], userRole: string): boolean {
//     return roles.includes(userRole);
//   }
// }
