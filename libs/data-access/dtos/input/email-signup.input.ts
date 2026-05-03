import { phoneRegex } from "@libs/common/constants";
import { GenderEnum } from "@libs/data-access";
import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty";
import { IsEmail } from "class-validator/types/decorator/string/IsEmail";
import { Matches } from "class-validator/types/decorator/string/Matches";
import { MaxLength } from "class-validator/types/decorator/string/MaxLength";
import { MinLength } from "class-validator/types/decorator/string/MinLength";
import { IsEnum } from "class-validator/types/decorator/typechecker/IsEnum";

@InputType()
export class EmailSignUpInput {
  @Field()
  @IsEmail({}, { message: "USER.INVALID_EMAIL" })
  @IsNotEmpty({ message: "USER.INVALID_EMAIL" })
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(3, { message: "USER.MIN_FULL_NAME" })
  @MaxLength(30, { message: "USER.MAX_FULL_NAME" })
  fullName: string;

  @Field()
  @IsNotEmpty({ message: "USER.INVALID_PHONE" })
  @Matches(phoneRegex, {
    message: "USER.INVALID_PHONE",
  })
  phone: string;

  @Field(() => GenderEnum)
  @IsEnum(GenderEnum, { message: "USER.INVALID_GENDER" })
  gender: GenderEnum;
}
