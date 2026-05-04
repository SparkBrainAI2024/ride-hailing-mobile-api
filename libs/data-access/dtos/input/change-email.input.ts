import { Field, InputType } from "@nestjs/graphql";
import { IsString ,IsNotEmpty} from "class-validator";

@InputType()
export class ChangeEmailInput {
  @Field()
  @IsNotEmpty({ message: "USER.SHOULDNOT_EMPTY" })
  @IsString({ message: "USER.SHOULD_STRING" })
  changeEmailToken: string;
}