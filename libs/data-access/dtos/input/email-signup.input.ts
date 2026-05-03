import { phoneRegex } from "@libs/common/constants";
import { GenderEnum } from "@libs/data-access";
import { Field, InputType } from "@nestjs/graphql";
import { IsEnum,IsEmail,IsNotEmpty, Matches,MaxLength,MinLength } from "class-validator";
@InputType()
export class EmailSignUpInput {
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
