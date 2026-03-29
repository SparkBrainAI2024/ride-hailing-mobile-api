import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthGuard, LangGuard } from "src/common/guards";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { CurrentLang } from "src/common/decorators/header.decorators";

import { UserDetailsService } from "../services/user.details.services";
import { CreateUserDetailsInput } from "../dto/user.details.dto";
import { UserDetailsResponse } from "../entities/user-details.entity";

@Resolver(() => UserDetailsResponse)
@UseGuards(AuthGuard, LangGuard)
export class UserDetailsResolver {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Mutation(() => UserDetailsResponse)
  updateUserDetails(
    @CurrentUser() user,
    @Args("input") input: CreateUserDetailsInput,
    @CurrentLang() lang: string,
  ) {
    return this.userDetailsService.update(user._id, input, lang);
  }

  @Query(() => UserDetailsResponse)
  getUserDetails(@CurrentUser() user, @CurrentLang() lang: string) {
    return this.userDetailsService.findOne(user._id, lang);
  }
}
