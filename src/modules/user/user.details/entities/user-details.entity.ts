import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserDetailsResponse {
  @Field({ nullable: true })
  _id?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  dateOfBirth?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  createdAt?: string;
}
