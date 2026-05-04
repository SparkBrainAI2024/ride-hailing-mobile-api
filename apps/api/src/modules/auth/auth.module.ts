import { Module } from "@nestjs/common";
import { AuthResolver } from "./resolver/auth.resolver";
import { UserAuthModule } from "@libs/services/auth/auth.module";
@Module({
  imports: [
    UserAuthModule.forRoot(), // ✅ use it properly
  ],
  providers: [
   AuthResolver
  ]
})
export class AuthModule {}
