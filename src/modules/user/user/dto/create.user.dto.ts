import { Field, InputType } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { passwordRegex } from "src/config/variable";
import { language } from "src/schema/user/user-enum";

@InputType()
export class ChangeEmailInput {
  @Field()
  @IsNotEmpty({ message: "USER.SHOULDNOT_EMPTY" })
  @IsString({ message: "USER.SHOULD_STRING" })
  changeEmailToken: string;
}

@InputType()
export class LogOutInput {
  @Field()
  @IsNotEmpty({ message: "USER.SHOULDNOT_EMPTY" })
  @IsString({ message: "USER.SHOULD_STRING" })
  deviceId: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty({ message: "USER.REQUIRED_PASSWORD" })
  oldPassword: string;

  @Field()
  @IsNotEmpty({ message: "USER.REQUIRED_PASSWORD" })
  @MinLength(8, { message: "USER.MIN_PASSWORD" })
  @MaxLength(20, { message: "USER.MAX_PASSWORD" })
  @Matches(passwordRegex, { message: "USER.INVALID_PASSWORD" })
  newPassword: string;
}

@InputType()
export class ChangeLanguageInput {
  @Field(() => String)
  @IsNotEmpty()
  language: language;
}

@InputType()
export class VerifyChangeEmailOTPInput {
  @Field()
  @IsEmail({}, { message: "USER.INVALID_EMAIL" })
  @IsNotEmpty({ message: "USER.INVALID_EMAIL" })
  email: string;

  @Field()
  @IsNotEmpty({ message: "USER.REQUIRED_OTP" })
  @IsString({ message: "USER.INVALID_OTP_FORMAT" })
  @Length(4, 6, { message: "USER.OTP_LENGTH" })
  @Matches(/^\d+$/, { message: "USER.OTP_DIGITS_ONLY" })
  otp: string;
}
