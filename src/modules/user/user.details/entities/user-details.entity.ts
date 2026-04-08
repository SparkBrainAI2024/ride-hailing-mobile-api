import { Field, ObjectType } from "@nestjs/graphql";
import { GenderEnum } from "src/schema/user/user-enum";

@ObjectType()
export class UserDetailsResponse {
  @Field({ nullable: true })
  _id?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field(() => GenderEnum)
  gender?: GenderEnum;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  dateOfBirth?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  createdAt?: string;
}
