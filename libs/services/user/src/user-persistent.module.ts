import { Device, DeviceRepository, DeviceSchema, User, UserDetails, UserDetailsRepository, UserDetailsSchema, UserRepository, UserSchema, UserVerification, UserVerificationRepository, UserVerificationSchema } from "@libs/data-access";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserVerification.name, schema: UserVerificationSchema },
      { name: UserDetails.name, schema: UserDetailsSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
  ],
  providers: [
    UserRepository,
    UserVerificationRepository,
    DeviceRepository,
    UserDetailsRepository,
  ],
  exports: [
    MongooseModule,
    UserRepository,
    UserVerificationRepository,
    DeviceRepository,
    UserDetailsRepository,
  ],
})
export class UserPersistenceModule {}