import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CountryListType {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  symbol: string;

  @Field(() => [String], { nullable: true })
  phoneCode: string[];
}
