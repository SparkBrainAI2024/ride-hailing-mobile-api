import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { verificationType } from "./user-enum";
import mongoose, { Document, Types } from "mongoose";
import { userOtpExpiredTime } from "../../config/variable";
import { ApiProperty } from "@nestjs/swagger";
import { Field, ID, ObjectType } from "@nestjs/graphql";

export type UserVerificationDocument = UserVerification & Document;

@ObjectType()
@Schema()
export class UserVerification {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Field()
  @Prop({ type: Number })
  otp: number;

  @Field(() => verificationType)
  @Prop({
    type: String,
    enum: verificationType,
    default: verificationType.EMAIL,
  })
  type: string;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserVerificationSchema =
  SchemaFactory.createForClass(UserVerification);
UserVerificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: userOtpExpiredTime },
);
