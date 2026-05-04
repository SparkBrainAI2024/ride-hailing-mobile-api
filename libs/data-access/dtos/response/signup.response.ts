import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SignUpResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  userToken?: string;
}