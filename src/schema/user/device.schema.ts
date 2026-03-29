import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { deviceType } from "./user-enum";

export type DeviceDocument = Device & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Device {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({
    type: Types.ObjectId,
    index: true,
    required: true,
    ref: "User",
  })
  userId: Types.ObjectId;

  @Field(() => ID)
  @Prop({
    type: Types.ObjectId,
    index: true,
    required: true,
  })
  deviceId: Types.ObjectId;

  @Field({ nullable: true })
  @Prop({
    type: String,
  })
  firebaseToken: string;

  @Field(() => deviceType, { defaultValue: deviceType.ANDROID })
  @Prop({
    type: String,
    enum: deviceType,
    default: deviceType.ANDROID,
    uppercase: true,
  })
  deviceType: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
