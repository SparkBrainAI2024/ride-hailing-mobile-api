import { Module } from "@nestjs/common";
import { CmsResolver } from "./resolvers/cms.resolver";
import { CmsService } from "./services/cms.services";

@Module({
  controllers: [],
  providers: [CmsService, CmsResolver],
})
export class CmsModule {}
