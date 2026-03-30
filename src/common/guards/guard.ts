import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JWT_SECRET_KEY } from "src/config";
import { tokenTypes } from "src/config/variable";
import { User, UserDocument } from "src/schema/user/user.schema";
import { verifyToken } from "../utils/jwt";
import { language } from "src/schema/user/user-enum";
import { GqlExecutionContext } from "@nestjs/graphql";

export const X_Auth_Header = "x-auth-token";
export const LANG_HEADER = "lang";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    let token = request.headers[X_Auth_Header];
    if (request && request.headers && request.headers[LANG_HEADER]) {
      request.lang =
        request.headers[LANG_HEADER] === language.NP
          ? language.NP
          : language.EN;
    }
    if (token) {
      const isVerifiedToken: any = await verifyToken(token, JWT_SECRET_KEY);
      if (!isVerifiedToken) {
        throw new HttpException(
          "COMMON.INVALID_TOKEN",
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (isVerifiedToken.type !== tokenTypes.accessToken) {
        throw new HttpException(
          "COMMON.INVALID_TOKEN",
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (isVerifiedToken.sessionId) {
        request.sessionId = isVerifiedToken.sessionId;
      } else {
        request.sessionId = null;
      }
      const haveUser: UserDocument = await this.userModel.findOne({
        _id: isVerifiedToken.id,
      });
      if (!haveUser) {
        throw new HttpException(
          "COMMON.USER_NOT_FOUND",
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (haveUser.suspended) {
        throw new HttpException("COMMON.SUSPENDED", HttpStatus.UNAUTHORIZED);
      }
      if (!haveUser.verified) {
        throw new HttpException(
          "COMMON.USER_NOT_VERIFIED",
          HttpStatus.UNAUTHORIZED,
        );
      }
      request.user = haveUser;
      request.lang = haveUser.language;
      return true;
    } else {
      throw new HttpException("COMMON.UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
  }
}

@Injectable()
export class LangGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    let defaultLanguage = language.NP;
    let token = request.headers[X_Auth_Header];

    if (request && request.headers && request.headers[LANG_HEADER]) {
      request.lang =
        request.headers[LANG_HEADER] === language.NP
          ? language.NP
          : language.EN;
    }
    if (token) {
      const isVerifiedToken: any = await verifyToken(token, JWT_SECRET_KEY);
      if (!isVerifiedToken) {
        request.lang = defaultLanguage;
        return true;
      }
      if (isVerifiedToken.type !== tokenTypes.accessToken) {
        request.lang = defaultLanguage;
        return true;
      }
      const haveUser: UserDocument = await this.userModel.findOne({
        _id: isVerifiedToken.id,
      });
      if (!haveUser) {
        request.lang = defaultLanguage;
        return true;
      }
      request.lang = request.user.language;
    }
    return true;
  }
}
