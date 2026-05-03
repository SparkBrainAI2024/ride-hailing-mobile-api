import { Field, InputType } from "@nestjs/graphql";
import { MinLength, MaxLength,IsNotEmpty } from "class-validator";

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
