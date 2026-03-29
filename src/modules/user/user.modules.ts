import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserDetailsModule } from "./user.details/user-details.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, UserModule, UserDetailsModule],
  providers: [UserModules],
})
export class UserModules {}
