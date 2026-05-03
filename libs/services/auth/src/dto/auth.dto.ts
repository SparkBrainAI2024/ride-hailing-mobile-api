import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Device Input DTO
@InputType()
export class DeviceInput {
  @Field()
  @IsString()
  deviceId: string;

  @Field()
  @IsString()
  firebaseToken: string;

  @Field()
  @IsString()
  deviceType: string;
}

// Sign Up Input DTO
@InputType()
export class SignUpInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  fullName: string;

  @Field()
  @IsString()
  gender: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;
}

// Set Password Input DTO
@InputType()
export class SetPasswordInput {
  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  confirmPassword: string;

  @Field()
  @IsString()
  userToken: string;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInput)
  device?: DeviceInput;
}

// Sign In Input DTO
@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInput)
  device?: DeviceInput;
}

// Send Verify Email OTP Input DTO
@InputType()
export class SendVerifyEmailOTPInput {
  @Field()
  @IsEmail()
  email: string;
}

// Verify Email Input DTO
@InputType()
export class VerifyEmailInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  otp: string;
}

// Verify Reset Password OTP Input DTO
@InputType()
export class VerifyResetPasswordOTPInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  otp: string;
}

// Reset Password Input DTO
@InputType()
export class ResetPasswordInput {
  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  resetPasswordToken: string;
}

// User Response DTO
@ObjectType()
export class UserResponse {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  verified: boolean;

  @Field()
  language: string;

  @Field()
  suspended: boolean;

  @Field()
  profileCompleted: boolean;

  @Field()
  loginAs: string;
}

// User Details Response DTO
@ObjectType()
export class UserDetailsResponse {
  @Field()
  fullName: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  dateOfBirth?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  gender: string;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  geoLocation?: Record<string, unknown>;
}

// Auth Response DTO
@ObjectType()
export class AuthResponse {
  @Field(() => UserResponse)
  user: UserResponse;

  @Field(() => UserDetailsResponse, { nullable: true })
  userDetails?: UserDetailsResponse;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

// Simple Message Response DTO
@ObjectType()
export class MessageResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}

// Token Response DTO
@ObjectType()
export class TokenResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  userToken?: string;

  @Field({ nullable: true })
  resetPasswordToken?: string;
}