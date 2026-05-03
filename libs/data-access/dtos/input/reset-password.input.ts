import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty";
import { MaxLength } from "class-validator/types/decorator/string/MaxLength";
import { MinLength } from "class-validator/types/decorator/string/MinLength";

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
