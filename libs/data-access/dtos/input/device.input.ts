import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty";

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
