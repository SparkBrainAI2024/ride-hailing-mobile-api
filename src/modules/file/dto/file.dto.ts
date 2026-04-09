import { Field, ObjectType, InputType } from "@nestjs/graphql";
import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { allowedFileExtensions } from "../../../config/variable";

@ObjectType()
export class S3UploadUrlEntity {
  @Field(() => String, {
    description:
      "Pre-signed URL for uploading the file directly to S3 using HTTP PUT",
  })
  uploadUrl: string;

  @Field(() => String, {
    description: "S3 object key (path inside the bucket). Save this in DB.",
  })
  key: string;
}

@InputType()
export class S3UploadUrlInput {
  @Field(() => String, {
    description: "File extension without dot (jpg, jpeg, png, webp)",
  })
  @IsNotEmpty({ message: "S3.REQUIRED_FILE_EXTENSION" })
  @IsString({ message: "S3.INVALID_FILE_EXTENSION" })
  @IsIn(allowedFileExtensions, { message: "S3.INVALID_FILE_EXTENSION" })
  fileExtension: string;
}
