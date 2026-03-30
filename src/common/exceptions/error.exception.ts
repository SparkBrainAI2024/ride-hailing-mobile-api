import { HttpException } from "@nestjs/common/exceptions/http.exception";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Message } from "../localiazation";
import { LANG_HEADER } from "../guards";

export const ErrorException = (
  e: any,
  defaultMessage: string,
  defaultStatus: number,
) => {
  const message = e?.message || defaultMessage;
  const status = e?.status || defaultStatus;

  throw new HttpException(message, status);
};

// Catching everything ensures the filter always runs
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const isHttp = host.getType() === "http";
    let request: any;

    if (isHttp) {
      const ctx = host.switchToHttp();
      request = ctx.getRequest();
    } else {
      const gqlCtx = GqlExecutionContext.create(host as any);
      request = gqlCtx.getContext().req;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception?.extensions?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? exception.getResponse()["message"] || exception.message
        : exception.message;

    let defaultLanguage = "EN";
    if (request?.headers?.[LANG_HEADER]) {
      defaultLanguage = request.headers[LANG_HEADER] === "NP" ? "NP" : "EN";
    }

    const translatedMessage = Message(defaultLanguage, rawMessage);

    if (isHttp) {
      const response = host.switchToHttp().getResponse();
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request?.url,
        message: translatedMessage,
      });
    }
    throw new GraphQLError(translatedMessage, {
      extensions: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request?.url,
      },
    });
  }
}
