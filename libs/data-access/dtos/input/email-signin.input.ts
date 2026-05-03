import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty";
import { IsEmail } from "class-validator/types/decorator/string/IsEmail";
import { DeviceInput } from "./device.input";

@InputType()
export class EmailSignInInput {
  @Field()
  @IsEmail({}, { message: "USER.INVALID_EMAIL" })
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field(() => DeviceInput, { nullable: true })
  device?: DeviceInput;
}