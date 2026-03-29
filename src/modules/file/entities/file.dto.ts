import { ApiProperty } from "@nestjs/swagger";

export class S3UploadUrlEntity {
  @ApiProperty({
    description:
      "Pre-signed URL for uploading the file directly to S3 using HTTP PUT",
  })
  uploadUrl: string;

  @ApiProperty({
    description: "S3 object key (path inside the bucket). Save this in DB.",
    example: "uploads/user-123/1731687300000.jpg",
  })
  key: string;
}
