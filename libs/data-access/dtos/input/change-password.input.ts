import { passwordRegex } from "@libs/common";
import { Field, InputType } from "@nestjs/graphql";
import { Matches,IsNotEmpty,MaxLength,MinLength } from "class-validator";

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