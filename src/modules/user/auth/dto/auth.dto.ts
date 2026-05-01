import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsIn,
  IsEnum,
} from "class-validator";
import { passwordRegex, phoneRegex } from "src/config/variable";
import { GenderEnum, roles } from "src/schema/user/user-enum";

@InputType()
export class DeviceInput {
  @Field()
  @IsNotEmpty()
  deviceId: string;

  @Field()
  @IsNotEmpty()
  firebaseToken: string;

  @Field()
  @IsNotEmpty()
  deviceType: string;
}

@InputType()
export class SetPasswordInput {
  @Field()
  @IsNotEmpty()
  userToken: string;

  @Field()
  @IsNotEmpty({ message: "USER.REQUIRED_PASSWORD" })
  @MinLength(8, { message: "USER.MIN_PASSWORD" })
  @MaxLength(20, { message: "USER.MAX_PASSWORD" })
  @Matches(passwordRegex, { message: "USER.INVALID_PASSWORD_INPUT" })
  password: string;

  @Field()
  @IsNotEmpty({ message: "USER.REQUIRED_PASSWORD" })
  @MinLength(8, { message: "USER.MIN_PASSWORD" })
  @MaxLength(20, { message: "USER.MAX_PASSWORD" })
  @Matches(passwordRegex, { message: "USER.INVALID_PASSWORD_INPUT" })
  confirmPassword: string;

  @Field(() => DeviceInput, { nullable: true })
  device?: DeviceInput;
}

@InputType()
export class SignUpInput {
  @Field()
  @IsEmail({}, { message: "USER.INVALID_EMAIL" })
  @IsNotEmpty({ message: "USER.INVALID_EMAIL" })
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(3, { message: "USER.MIN_FULL_NAME" })
  @MaxLength(30, { message: "USER.MAX_FULL_NAME" })
  fullName: string;

  @Field()
  @IsNotEmpty({ message: "USER.INVALID_PHONE" })
  @Matches(phoneRegex, {
    message: "USER.INVALID_PHONE",
  })
  phone: string;

  @Field(() => GenderEnum)
  @IsEnum(GenderEnum, { message: "USER.INVALID_GENDER" })
  gender: GenderEnum;
}

@InputType()
export class SignInInput {
  @Field()
  @IsEmail({}, { message: "USER.INVALID_EMAIL" })
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field(() => DeviceInput, { nullable: true })
  device?: DeviceInput;
}

@InputType()
export class EmailInput {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class RefreshTokenInput {
  @Field()
  @IsNotEmpty()
  refreshToken: string;
}

@InputType()
export class VerifyResetPasswordOTPInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(4, 6)
  @Matches(/^\d+$/)
  otp: string;
}

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(4, 6)
  @Matches(/^\d+$/)
  otp: string;
}

@InputType()
export class SendVerifyEmailOTPInput {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @Field()
  @IsNotEmpty()
  resetPasswordToken: string;
}
