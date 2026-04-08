import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { language, roles } from "./user-enum";
import { hashPassword } from "src/common/utils/bcrypt";
import { passwordSalt } from "src/config/variable";

export type UserDocument = User & Document;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({ nullable: true })
  @Prop({ unique: true })
  email?: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Prop()
  password: string;

  @Field({ defaultValue: false })
  @Prop({ default: false })
  suspended: boolean;

  @Field({ defaultValue: false })
  @Prop({ default: false })
  verified: boolean;

  @Field({ nullable: true })
  @Prop({ default: null })
  lastLogin?: Date;

  @Field(() => language, { defaultValue: language.EN })
  @Prop({ type: String, enum: language, default: language.EN })
  language: string;

  @Field(() => [roles], { defaultValue: [roles.USER] })
  @Prop({ type: [String], enum: roles, default: [roles.USER] })
  roles: string[];

  @Field(() => roles, { defaultValue: roles.USER })
  @Prop({ type: String, enum: roles, default: roles.USER })
  loginAs: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
