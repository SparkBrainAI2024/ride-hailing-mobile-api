import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { FilesInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import { extname } from "path";
import { generateNanoId } from "../utils/id.generator";
import { ErrorException } from "../exceptions/error.exception";
import { HttpException } from "@nestjs/common/exceptions/http.exception";

export const MAX_FILE_SIZE_BYTES = 500 * 1024; // 500KB
export const ALLOWED_FILE_TYPES = ["jpg", "jpeg", "png", "svg"];

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const filesInterceptor = FilesInterceptor("file", null, {
      storage: multer.diskStorage({
        destination: "./files",
        filename: (req: any, file: any, callback: any) => {
          const fileExtName = extname(file.originalname);
          callback(null, `${generateNanoId("file")}${fileExtName}`);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
      },
      fileFilter: (req: any, file: any, callback: any) => {
        try {
          if (
            !ALLOWED_FILE_TYPES.includes(
              file.originalname.split(".").pop().toLowerCase(),
            )
          ) {
            return callback(
              new HttpException(
                "COMMON.INVALID_FILE_TYPE",
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
          if (file.size > MAX_FILE_SIZE_BYTES) {
            return callback(
              new HttpException(
                "COMMON.INVALID_FILE_SIZE",
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
          callback(null, true);
        } catch (e) {
          ErrorException(
            e,
            "COMMON.INTERNAL_SERVER_ERROR",
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    });
    const handler: any = new filesInterceptor().intercept(context, next);
    return handler;
  }
}
