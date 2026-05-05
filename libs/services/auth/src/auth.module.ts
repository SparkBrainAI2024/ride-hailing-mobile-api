import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthService } from './auth.service';
import { MailService } from '@libs/services/mail';
import { EnvService } from '@libs/common/config/env.service';

import {
  UserRepository,
  UserVerificationRepository,
  DeviceRepository,
  UserDetailsRepository,
  User,
  UserSchema,
  UserVerification,
  UserVerificationSchema,
  UserDetailsSchema,
  UserDetails,
  Device,
  DeviceSchema,
} from '@libs/data-access';

export interface AuthModuleOptions {
  imports?: any[];
  providers?: Provider[];
}

@Module({})
export class UserAuthModule {
  static forRoot(options: AuthModuleOptions = {}): DynamicModule {
    const { imports = [], providers = [] } = options;

    return {
      module: UserAuthModule,
      imports: [
        ConfigModule,

        // ✅ Mongoose models
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: UserVerification.name, schema: UserVerificationSchema },
          { name: UserDetails.name, schema: UserDetailsSchema },
          { name: Device.name, schema: DeviceSchema },
        ]),

        // ✅ Mailer properly configured
        MailerModule.forRoot({
          transport: {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 587,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          },
        }),

        ...imports,
      ],

      providers: [
        AuthService,
        MailService,
        EnvService,
        UserRepository,
        UserVerificationRepository,
        DeviceRepository,
        UserDetailsRepository,
        ...providers,
      ],

      // ✅ export everything needed OUTSIDE
      exports: [
        AuthService,
        MailService,
        UserRepository,
        UserVerificationRepository,
        DeviceRepository,
        UserDetailsRepository,
        MongooseModule,
        EnvService,
        // 🔥 fixes UserModel error (if ever needed)
      ],
    };
  }
}