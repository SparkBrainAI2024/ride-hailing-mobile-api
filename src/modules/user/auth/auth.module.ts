import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "../../../providers/mail/mail.module";
import { UserDetailsRepository } from "../../../repositories/user/user.details.repository";
import { UserRepository } from "../../../repositories/user/user.repository";
import { UserVerificationRepository } from "../../../repositories/user/user.verification.repository";
import {
  UserDetails,
  UserDetailsSchema,
} from "../../../schema/user/user.details.schema";
import { User, UserSchema } from "../../../schema/user/user.schema";
import {
  UserVerification,
  UserVerificationSchema,
} from "../../../schema/user/user.verification";
import { AuthResolver } from "./resolvers/auth.resolver";
import { AuthService } from "./services/auth.services";
import { Device, DeviceSchema } from "../../../schema/user/device.schema";
import { DeviceRepository } from "../../../repositories/user/device.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserVerification.name, schema: UserVerificationSchema },
      { name: UserDetails.name, schema: UserDetailsSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
    MailModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    DeviceRepository,
    UserRepository,
    UserVerificationRepository,
    UserDetailsRepository,
  ],
})
export class AuthModule {}
