import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "src/providers/mail/mail.module";
import { UserDetailsRepository } from "src/repositories/user/user.details.repository";
import { UserRepository } from "src/repositories/user/user.repository";
import { UserVerificationRepository } from "src/repositories/user/user.verification.repository";
import {
  UserDetails,
  UserDetailsSchema,
} from "src/schema/user/user.details.schema";
import { User, UserSchema } from "src/schema/user/user.schema";
import {
  UserVerification,
  UserVerificationSchema,
} from "src/schema/user/user.verification";
import { UserResolver } from "./resolvers/user.resolver";
import { UserService } from "./services/user.services";
import { Device, DeviceSchema } from "src/schema/user/device.schema";
import { DeviceRepository } from "src/repositories/user/device.repository";

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
    UserResolver,
    UserService,
    DeviceRepository,
    UserRepository,
    UserVerificationRepository,
    UserDetailsRepository,
  ],
})
export class UserModule {}
