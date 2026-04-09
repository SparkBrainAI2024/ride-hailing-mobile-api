import { Field, InputType } from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsPhoneNumber,
  ValidateNested,
  MinLength,
  MaxLength,
  IsDate,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { IsValidDate } from "../../../../common/decorators/validation/date-of-birth.decorator";
import { GeoLocationInput } from "../../../../common/dto/geo.location.dto";
import { GenderEnum } from "../../../../schema/user/user-enum";

@InputType()
export class CreateUserDetailsInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "USER.MIN_FULL_NAME" })
  @MaxLength(30, { message: "USER.MAX_FULL_NAME" })
  fullName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "USER.INVALID_ADDRESS" })
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "USER.INVALID_PROFILE_IMAGE" })
  profileImage?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber(null, { message: "USER.INVALID_PHONE" })
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "USER.INVALID_DOB" })
  @IsValidDate({ message: "USER.INVALID_DOB_RANGE" })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "USER.INVALID_BIO" })
  bio?: string;

  @Field(() => GeoLocationInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationInput)
  geoLocation?: GeoLocationInput;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(GenderEnum, { message: "USER.INVALID_GENDER" })
  gender?: GenderEnum;
}
