import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MailService } from '@libs/services/mail';
import {
  UserRepository,
  UserVerificationRepository,
  DeviceRepository,
  UserDetailsRepository,
} from '@libs/data-access';

export interface AuthModuleOptions {
  imports?: any[];
  providers?: Provider[];
}

@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions = {}): DynamicModule {
    const { imports = [], providers = [] } = options;

    const defaultProviders: Provider[] = [
      AuthService,
      MailService,
      UserRepository,
      UserVerificationRepository,
      DeviceRepository,
      UserDetailsRepository,
    ];

    return {
      module: AuthModule,
      imports: [ConfigModule, ...imports],
      providers: [...defaultProviders, ...providers],
      exports: [AuthService, MailService],
    };
  }

  static forRootAsync(options: AuthModuleOptions = {}): DynamicModule {
    const { imports = [], providers = [] } = options;

    const defaultProviders: Provider[] = [
      AuthService,
      MailService,
      UserRepository,
      UserVerificationRepository,
      DeviceRepository,
      UserDetailsRepository,
    ];

    return {
      module: AuthModule,
      imports: [ConfigModule, ...imports],
      providers: [...defaultProviders, ...providers],
      exports: [AuthService, MailService],
    };
  }
}