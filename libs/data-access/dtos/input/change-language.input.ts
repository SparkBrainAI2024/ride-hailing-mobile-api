import { language } from "@libs/data-access/enums/user.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class ChangeLanguageInput {
  @Field(() => String)
  @IsNotEmpty()
  language: language;
}
