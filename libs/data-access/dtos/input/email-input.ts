import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator/types/decorator/string/IsEmail";

@InputType()
export class EmailInput {
  @Field()
  @IsEmail()
  email: string;
}