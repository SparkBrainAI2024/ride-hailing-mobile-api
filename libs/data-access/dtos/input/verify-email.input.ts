import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator/types/decorator/string/IsEmail";
import { Length } from "class-validator/types/decorator/string/Length";
import { Matches } from "class-validator/types/decorator/string/Matches";

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