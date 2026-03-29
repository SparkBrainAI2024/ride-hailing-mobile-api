import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CmsModule } from "./modules/cms/cms.module";
import { UserModules } from "./modules/user/user.modules";
import { DatabaseProvider } from "./providers/database";
import { FileModule } from "./modules/file/file.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      // Auto-generate schema file
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),

      // Enable playground (dev only)
      playground: true,
    }),
    DatabaseProvider,
    CmsModule,
    FileModule,
    UserModules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
