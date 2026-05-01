import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

export type Coordinates = [number, number];

export class GeoLocation {
  @Prop({ type: String, enum: ["Point"], default: "Point", required: true })
  @ApiProperty()
  type: string;

  @Prop({ type: [Number], required: true })
  @ApiProperty({ type: [Number], example: [-74.0, 40.71] })
  coordinates: [number, number];
}
