import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty";
import { IsString } from "class-validator/types/decorator/typechecker/IsString";

@InputType()
export class ChangeEmailInput {
  @Field()
  @IsNotEmpty({ message: "USER.SHOULDNOT_EMPTY" })
  @IsString({ message: "USER.SHOULD_STRING" })
  changeEmailToken: string;
}