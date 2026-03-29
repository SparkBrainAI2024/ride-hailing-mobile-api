import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { GeoLocation } from "../common/geo.location";
import { gender } from "./user-enum";

export type UserDetailsDocument = UserDetails &
  Document & { createdAt: Date; updatedAt: Date };

@ObjectType()
@Schema({ timestamps: true })
export class UserDetails {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, index: true, ref: "User" })
  userId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field({ nullable: true })
  @Prop()
  address?: string;

  @Field({ nullable: true })
  @Prop()
  profileImage?: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop({ type: Date, default: null })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @Prop()
  bio?: string;

  @Field(() => GeoLocation, { nullable: true })
  @Prop({ type: Object, default: {} })
  geoLocation?: GeoLocation;

  @Field(() => gender, { defaultValue: gender.UNPUBLISHED })
  @Prop({ type: String, enum: gender, default: gender.UNPUBLISHED })
  gender: string;
}

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);
