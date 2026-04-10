import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CmsModule } from "./modules/cms/cms.module";
import { UserModules } from "./modules/user/user.modules";
import { DatabaseProvider } from "./providers/database";
import { FileModule } from "./modules/file/file.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";

const isProduction =
  process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      autoSchemaFile: isProduction
        ? true
        : join(process.cwd(), "src/schema.gql"),

      context: ({ req }) => ({ req }),

      formatError: (error) => ({
        message: error.message,
        statusCode: error.extensions?.statusCode || 500,
        path: error.path,
        timestamp: error.extensions?.timestamp || new Date().toISOString(),
      }),

      introspection: true,

      playground: !isProduction,
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
