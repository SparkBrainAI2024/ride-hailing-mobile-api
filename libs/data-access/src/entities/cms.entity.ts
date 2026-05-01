import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'cms_contents', timestamps: true, versionKey: false })
@ObjectType()
export class CmsEntity {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true, trim: true })
  @Field(() => String)
  key: string;

  @Prop({ required: true, trim: true })
  @Field(() => String)
  value: string;
}

export type CmsDocument = HydratedDocument<CmsEntity>;
export const CmsSchema = SchemaFactory.createForClass(CmsEntity);
CmsSchema.index({ key: 1 }, { unique: true });
