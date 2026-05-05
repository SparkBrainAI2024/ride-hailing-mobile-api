import { Module } from "@nestjs/common";
import { UserPersistenceModule } from "./user-persistent.module";
import { UserService } from "./user.service";

@Module({
  imports: [UserPersistenceModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserServiceModule {}