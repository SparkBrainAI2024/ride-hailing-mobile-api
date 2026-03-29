import { HttpStatus, Injectable } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ErrorException } from "src/common/exceptions/error.exception";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_UPLOAD_PREFIX,
  AWS_SECRET_KEY,
  S3_BUCKET_NAME,
} from "src/config";

const UPLOAD_PREFIX = AWS_S3_UPLOAD_PREFIX || "uploads";

export interface S3UploadUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

@Injectable()
export class S3ServiceProvider {
  private readonly s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_KEY!,
    },
  });

  /**
   * Generate a presigned URL that the client can use to upload directly to S3
   */
  async getPresignedUploadUrl(
    fileExtension: string,
    userId: string
  ): Promise<S3UploadUrlResponse> {
    try {
      const timestamp = Date.now();
      const cleanExt = fileExtension.replace(".", "");

      const key = `${UPLOAD_PREFIX}/user-${userId}/${timestamp}.${cleanExt}`;

      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        ContentType: this.detectMimeType(cleanExt),
      });

      const uploadUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 300, // 5 minutes
      });

      // final public URL (if bucket objects are public)
      const fileUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

      return { uploadUrl, fileUrl, key };
    } catch (e) {
      throw ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Optional: Generate a presigned GET URL if objects are not public
   */
  async getPresignedViewUrl(key: string, expiresInSec = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: expiresInSec });
    } catch (e) {
      throw ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Helper to guess the mime type of the file
   */
  private detectMimeType(ext: string) {
    const map: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };

    return map[ext.toLowerCase()] || "application/octet-stream";
  }
}
