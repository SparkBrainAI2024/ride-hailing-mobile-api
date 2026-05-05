import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { envConfiguration, HealthResolver } from '@libs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', load: [envConfiguration] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION_URL'),
      }),
    }),
     GraphQLModule.forRoot<ApolloDriverConfig>({
       driver: ApolloDriver,
       autoSchemaFile: join(process.cwd(), 'apps/admin-api/src/schema.gql'),
       playground: false,
       introspection: true,
       plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
     }),
  ],
  providers: [HealthResolver],
})
export class AppModule {}
