import { HttpStatus } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ErrorException } from "src/common/exceptions/error.exception";
import { S3ServiceProvider } from "src/providers/s3/s3.service";
import { S3UploadUrlInput } from "../dto/file.dto";

@Injectable()
export class FileService {
  constructor(private readonly s3Service: S3ServiceProvider) {}

  async generateUploadUrl(input: S3UploadUrlInput, userId: string) {
    try {
      const { fileExtension } = input;

      // You can later use `folder` to adjust key pattern if you want
      const { uploadUrl, key } = await this.s3Service.getPresignedUploadUrl(
        fileExtension,
        userId
      );

      return { uploadUrl, key };
    } catch (e) {
      throw ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
