import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserDetailsRepository } from "src/repositories/user/user.details.repository";
import {
  UserDetails,
  UserDetailsSchema,
} from "src/schema/user/user.details.schema";
import { UserDetailsResolver } from "./resolvers/user.details.resolver";
import { UserDetailsService } from "./services/user.details.services";
import { UserRepository } from "src/repositories/user/user.repository";
import { User, UserSchema } from "src/schema/user/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDetails.name, schema: UserDetailsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    UserDetailsResolver,
    UserDetailsService,
    UserDetailsRepository,
    UserRepository,
  ],
})
export class UserDetailsModule {}
