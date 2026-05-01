import { Field, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType({ isAbstract: true })
export class BaseEntity {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  deleted?: boolean;
}
