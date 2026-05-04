import { Types } from 'mongoose';

import { TokenGrantType } from '../enums/token.enum';
import {  roles, UserStatus } from '../enums/user.enum';

export interface UserJwtPayload {
  sub: Types.ObjectId;
  jti: string;
  grant: TokenGrantType;
  role: roles;
}

export interface AdminJwtPayload {
  sub: Types.ObjectId;
  jti: string;
  grant: TokenGrantType;
  role: roles;
}

export interface JwtResponse {
  accessToken: string;
  accessTokenExpiresIn: Date;
  refreshToken: string;
  refreshTokenExpiresIn: Date;
}

export interface JwtAdminUser {
  _id: Types.ObjectId;
  name: string;
  role: roles;
  jti: string;
  status: UserStatus;
  permissions: string[];
}

export interface JwtUser {
  _id: Types.ObjectId;
  role: roles;
  jti: string;
}
