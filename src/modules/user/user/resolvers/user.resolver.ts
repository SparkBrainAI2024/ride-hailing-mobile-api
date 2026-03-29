import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guards";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { CurrentLang } from "src/common/decorators/header.decorators";
import { UserService } from "../services/user.services";
import {
  ChangeLanguageInput,
  ChangePasswordInput,
  LogOutInput,
  VerifyChangeEmailOTPInput,
} from "../dto/create.user.dto";

import { UserDetailEntity } from "../entities/user.entity";
import { BasicResponse } from "src/common/entity/common.entity";

@Resolver()
@UseGuards(AuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => BasicResponse)
  logOut(
    @Args("input") input: LogOutInput,
    @CurrentUser() user,
    @CurrentLang() lang: string,
  ) {
    return this.userService.logOut(input.deviceId, user._id, lang);
  }

  @Mutation(() => BasicResponse)
  changePassword(
    @Args("input") input: ChangePasswordInput,
    @CurrentUser() user,
    @CurrentLang() lang: string,
  ) {
    return this.userService.changePassword(input, user._id, lang);
  }

  @Mutation(() => BasicResponse)
  changeLanguage(
    @Args("input") input: ChangeLanguageInput,
    @CurrentUser() user,
  ) {
    return this.userService.changeLanguage(input.language, user._id);
  }

  @Mutation(() => BasicResponse)
  verifyChangeEmailOTP(
    @Args("input") input: VerifyChangeEmailOTPInput,
    @CurrentUser() user,
    @CurrentLang() lang: string,
  ) {
    return this.userService.verifyChangeEmailOTP(input, lang, user._id);
  }

  @Query(() => UserDetailEntity)
  getUser(@CurrentUser() user) {
    return this.userService.getUserById(user._id);
  }
}
