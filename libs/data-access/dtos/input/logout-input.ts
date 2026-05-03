import { Field, InputType } from "@nestjs/graphql";
import {
    IsNotEmpty,
    IsString,
} from "class-validator";

@InputType()
export class LogOutInput {
    @Field()
    @IsNotEmpty({ message: "USER.SHOULDNOT_EMPTY" })
    @IsString({ message: "USER.SHOULD_STRING" })
    deviceId: string;
}