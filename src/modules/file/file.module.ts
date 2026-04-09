import { Module } from "@nestjs/common";
import { S3ServiceProvider } from "../../providers/s3/s3.service";
import { FileResolver } from "./resolvers/file.resolver";
import { FileService } from "./services/file.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../schema/user/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [FileService, FileResolver, S3ServiceProvider],
})
export class FileModule {}
