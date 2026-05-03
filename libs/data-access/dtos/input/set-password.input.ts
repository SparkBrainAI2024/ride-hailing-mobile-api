import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty";
import { MinLength } from "class-validator/types/decorator/string/MinLength";
import { MaxLength } from "class-validator/types/decorator/string/MaxLength";
import { Matches } from "class-validator";
import { passwordRegex } from "@libs/common/constants";
import { DeviceInput } from "./device.input";


@InputType()
export class SetPasswordInput {
  @Field()
  @IsNotEmpty()
  userToken: string;

  @Field()
  @IsNotEmpty({ message: "USER.REQUIRED_PASSWORD" })
  @MinLength(8, { message: "USER.MIN_PASSWORD" })
  @MaxLength(20, { message: "USER.MAX_PASSWORD" })
  @Matches(passwordRegex, { message: "USER.INVALID_PASSWORD_INPUT" })
  password: string;

  @Field()
  @IsNotEmpty({ message: "USER.REQUIRED_PASSWORD" })
  @MinLength(8, { message: "USER.MIN_PASSWORD" })
  @MaxLength(20, { message: "USER.MAX_PASSWORD" })
  @Matches(passwordRegex, { message: "USER.INVALID_PASSWORD_INPUT" })
  confirmPassword: string;

  @Field(() => DeviceInput, { nullable: true })
  device?: DeviceInput;
}
