import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class DeviceInput {
  @Field()
  @IsNotEmpty()
  deviceId: string;

  @Field()
  @IsNotEmpty()
  firebaseToken: string;

  @Field()
  @IsNotEmpty()
  deviceType: string;
}
