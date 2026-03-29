import { Field, ObjectType } from "@nestjs/graphql";
import { UserDetailsResponse } from "../../user.details/entities/user-details.entity";

@ObjectType()
export class UserDetailEntity {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field()
  verified: boolean;

  @Field()
  suspended: boolean;

  @Field()
  language: string;

  @Field()
  loginAs: string;

  @Field(() => UserDetailsResponse)
  userDetails: UserDetailsResponse;
}
