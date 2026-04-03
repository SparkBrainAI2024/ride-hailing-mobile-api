import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { LangGuard } from "src/common/guards";
import { CurrentLang } from "src/common/decorators/header.decorators";
import { AuthService } from "../services/auth.services";
import {
  SignInResponse,
  SignUpResponse,
  VerifyResetPasswordOtpResponse,
} from "../entities/auth.entity";
import {
  RefreshTokenInput,
  ResetPasswordInput,
  SendVerifyEmailOTPInput,
  SetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
  VerifyResetPasswordOTPInput,
} from "../dto/auth.dto";
import { BasicResponse } from "src/common/entity/common.entity";

@Resolver()
@UseGuards(LangGuard)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpResponse)
  signUp(@Args("input") input: SignUpInput, @CurrentLang() lang: string) {
    return this.authService.signup(input, lang);
  }

  @Mutation(() => BasicResponse)
  setPassword(
    @Args("input") input: SetPasswordInput,
    @CurrentLang() lang: string,
  ) {
    return this.authService.setPassword(input, lang);
  }

  @Mutation(() => BasicResponse)
  verifyEmail(
    @Args("input") input: VerifyEmailInput,
    @CurrentLang() lang: string,
  ) {
    return this.authService.verifyEmail(input, lang);
  }

  @Mutation(() => SignInResponse)
  async signIn(@Args("input") input: SignInInput) {
    return this.authService.signIn(input);
  }

  @Mutation(() => SignInResponse)
  loginWithRefreshToken(@Args("input") input: RefreshTokenInput) {
    return this.authService.loginWithRefreshToken(input.refreshToken);
  }

  @Mutation(() => BasicResponse)
  sendVerifyEmailOtp(
    @Args("input") input: SendVerifyEmailOTPInput,
    @CurrentLang() lang: string,
  ) {
    return this.authService.sendVerifyEmailOtp(input, lang);
  }

  @Mutation(() => VerifyResetPasswordOtpResponse)
  verifyResetPasswordOtp(
    @Args("input") input: VerifyResetPasswordOTPInput,
    @CurrentLang() lang: string,
  ) {
    return this.authService.verifyResetPasswordOTP(input, lang);
  }

  @Mutation(() => BasicResponse)
  resetPassword(
    @Args("input") input: ResetPasswordInput,
    @CurrentLang() lang: string,
  ) {
    return this.authService.resetPassword(input, lang);
  }
}
