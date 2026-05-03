// import { UnauthorizedException, Injectable } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { AuthGuard } from '@nestjs/passport';
// import { TokenExpiredError } from 'jsonwebtoken';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   getRequest(context: GqlExecutionContext) {
//     const ctx = GqlExecutionContext.create(context);
//     return ctx.getContext().req;
//   }
//   handleRequest(err, user, info: Error) {
//     if (err || !user) {
//       if (info instanceof TokenExpiredError) {
//         throw new UnauthorizedException('TokenExpiredError');
//       }
//       throw err || new UnauthorizedException();
//     }
//     return user;
//   }
// }
