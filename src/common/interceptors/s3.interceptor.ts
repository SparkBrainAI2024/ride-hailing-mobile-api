import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map } from "rxjs";
import { S3_BUCKET_NAME, AWS_REGION } from "../../config";

const BASE_URL = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;

export function mapS3KeysToUrls(keys: string[] | undefined): string[] {
  if (!keys || !keys.length) return [];
  return keys.map((key) =>
    /^https?:\/\//i.test(key) ? key : `${BASE_URL}/${key}`
  );
}

@Injectable()
export class S3UrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const seen = new WeakSet(); // avoid circular references

        function mapRecursively(obj: any): any {
          if (!obj || typeof obj !== "object") return obj;
          if (seen.has(obj)) return obj;
          seen.add(obj);

          if (Array.isArray(obj)) {
            return obj.map(mapRecursively);
          }

          for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            const value = obj[key];

            // Convert images array
            if (Array.isArray(value) && key === "images") {
              obj[key] = mapS3KeysToUrls(value);
            }
            // Convert single-file image field
            else if (
              typeof value === "string" &&
              key.toLowerCase().includes("image") &&
              !/^https?:\/\//i.test(value)
            ) {
              obj[key] = `${BASE_URL}/${value}`;
            }
            // Recurse nested objects/arrays
            else if (typeof value === "object") {
              obj[key] = mapRecursively(value);
            }
          }

          return obj;
        }

        return mapRecursively(data);
      })
    );
  }
}
