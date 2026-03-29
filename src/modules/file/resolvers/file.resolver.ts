import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guards";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UserDocument } from "src/schema/user/user.schema";
import { FileService } from "../services/file.service";
import { S3UploadUrlEntity, S3UploadUrlInput } from "../dto/file.dto";

@Resolver()
@UseGuards(AuthGuard)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => S3UploadUrlEntity, {
    name: "generateUploadUrl",
    description:
      "Generates a temporary pre-signed URL to upload file directly to S3",
  })
  async getUploadUrl(
    @Args("input") input: S3UploadUrlInput,
    @CurrentUser() user: UserDocument,
  ): Promise<S3UploadUrlEntity> {
    return this.fileService.generateUploadUrl(input, String(user._id));
  }
}
