import { Field, ObjectType } from "@nestjs/graphql";
import { BasicResponse } from "./basic.response";

@ObjectType()
export class VerifyResetPasswordOtpResponse extends BasicResponse {
  @Field()
  resetPasswordToken: string;
}
