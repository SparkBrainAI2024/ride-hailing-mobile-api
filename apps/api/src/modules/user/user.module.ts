import { Module } from "@nestjs/common";
import { UserServiceModule } from "@libs/service/user/src/user.module";
import { UserResolver } from "./resolver/user.resolver";
import { EnvService } from "@libs/common/config/env.service";
import { UserPersistenceModule } from "@libs/service/user/src/user-persistent.module";

@Module({
    imports: [
        UserPersistenceModule,
        UserServiceModule // ✅ use it properly
    ],
    providers: [
        UserResolver,
        EnvService,
    ]
})
export class UserModule { }
