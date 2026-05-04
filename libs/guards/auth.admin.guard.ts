// import { GqlExecutionContext } from '@nestjs/graphql';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class AdminJwtAuthGuard extends AuthGuard('adminJwt') {
//   getRequest(context: GqlExecutionContext) {
//     const ctx = GqlExecutionContext.create(context);
//     return ctx.getContext().req;
//   }
//   handleRequest(err, admin, info) {
//     if (err || !admin) {
//       throw err || new UnauthorizedException();
//     }
//     return admin;
//   }
// }
