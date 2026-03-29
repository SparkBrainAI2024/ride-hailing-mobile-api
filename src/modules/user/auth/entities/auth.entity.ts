import { Field, ObjectType } from "@nestjs/graphql";
import { UserDetailsResponse } from "../../user.details/entities/user-details.entity";
import { BasicResponse } from "src/common/entity/common.entity";

@ObjectType()
export class CoreUserDetails {
  @Field()
  email: string;

  @Field()
  verified: boolean;

  @Field()
  suspended: boolean;

  @Field()
  _id: string;

  @Field()
  language: string;

  @Field()
  loginAs: string;
}

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => CoreUserDetails)
  user: CoreUserDetails;

  @Field(() => UserDetailsResponse)
  userDetails: UserDetailsResponse;
}

@ObjectType()
export class VerifyResetPasswordOtpResponse extends BasicResponse {
  @Field()
  resetPasswordToken: string;
}
