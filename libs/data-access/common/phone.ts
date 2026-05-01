import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class PhoneAreaCode {
    @Prop({ type: String, default: null })
    @ApiProperty({ nullable: true })
    country: String;

    @Prop({
        type: String,
        default: null
    })
    @ApiProperty({ nullable: true })
    code: String
}
