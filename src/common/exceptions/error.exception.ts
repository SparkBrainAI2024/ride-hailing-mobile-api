import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { Message } from "../localiazation";
import { LANG_HEADER } from "../guards";

export const ErrorException = (
  e: any,
  defaultMessage: string,
  defaultStatus: number
) => {
  const message = e
    ? e.message
      ? e.message
      : defaultMessage
    : defaultMessage;
  const status = e ? (e.status ? e.status : defaultStatus) : defaultStatus;
  throw new HttpException(message, status);
};


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request | any>();
    let defaultLanguage = "EN"
    if (request && request.headers && request.headers[LANG_HEADER]) {
      defaultLanguage = request.headers[LANG_HEADER] === "NP" ? "NP" : "EN"
    }
    if (request && request.user && request.user.language) {
      defaultLanguage = request.user.language
    }
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: Message(defaultLanguage, exception.message)
      });
  }
}
