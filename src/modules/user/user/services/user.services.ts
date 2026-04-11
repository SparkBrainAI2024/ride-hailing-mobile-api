import { HttpStatus } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ErrorException } from "src/common/exceptions/error.exception";
import { comparePassword, hashPassword } from "src/common/utils/bcrypt";
import { passwordSalt } from "src/config/variable";
import { UserRepository } from "src/repositories/user/user.repository";
import { UserDocument } from "src/schema/user/user.schema";
import {
  ChangePasswordInput,
  VerifyChangeEmailOTPInput,
} from "../dto/create.user.dto";
import { Message } from "src/common/localiazation";
import { DeviceRepository } from "src/repositories/user/device.repository";
import { language, verificationType } from "src/schema/user/user-enum";
import { UserVerificationRepository } from "src/repositories/user/user.verification.repository";
import { UserDetailsDocument } from "src/schema/user/user.details.schema";
import { UserDetailsRepository } from "src/repositories/user/user.details.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly deviceRepository: DeviceRepository,
    private readonly userVerificationRepository: UserVerificationRepository,
    private readonly userDetailsRepository: UserDetailsRepository
  ) {}
  async logOut(deviceId: string, userId: string, lang) {
    try {
      await this.deviceRepository.logout(userId, deviceId);
      return { message: Message(lang, "USER.LOGGED_OUT"), success: true };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changePassword(
    changePasswordInput: ChangePasswordInput,
    userId: string,
    lang: string
  ) {
    try {
      const { newPassword, oldPassword } = changePasswordInput;
      const user: UserDocument = await this.userRepository.findOne({
        _id: userId,
      });
      if (!user) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.NOT_FOUND);
      }
      const checkPassword = await comparePassword(oldPassword, user.password);
      if (!checkPassword) {
        ErrorException(null, "USER.INCORRECT_PASSWORD", HttpStatus.BAD_REQUEST);
      }
      await this.userRepository.updateOne(
        { _id: user._id },
        { password: await hashPassword(newPassword, passwordSalt) }
      );
      return { message: Message(lang, "USER.PASSWORD_UPDATED"), success: true };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changeLanguage(language: language, userId: string) {
    try {
      await this.userRepository.updateOne(
        {
          _id: userId,
        },
        { lanugage: language }
      );
      return {
        message: Message(language, "USER.LANGUAGE_UPDATED"),
        success: true,
      };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserById(userId: string) {
    try {
      const user: UserDocument = await this.userRepository.findOne({
        _id: userId,
      });
      const userDetails: UserDetailsDocument =
        await this.userDetailsRepository.findOne({
          userId: user._id,
        });
      if (!user || !userDetails) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.NOT_FOUND);
      }
      return {
        _id: user._id,
        email: user.email,
        verified: user.verified,
        language: user.language,
        suspended: user.suspended,
        profileCompleted: user.profileCompleted,
        loginAs: user.loginAs,
        userDetails: userDetails,
      };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyChangeEmailOTP(
    verifyOTPlInput: VerifyChangeEmailOTPInput,
    lang: string,
    userId
  ) {
    try {
      const { email, otp } = verifyOTPlInput;
      const user: UserDocument = await this.userRepository.findOne({
        _id: userId,
      });
      if (!user) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.NOT_FOUND);
      }
      if (user.suspended) {
        ErrorException(null, "USER.SUSPENDED", HttpStatus.UNAUTHORIZED);
      }
      const code = await this.userVerificationRepository.findOne({
        userId: user._id,
        otp: otp,
        type: verificationType.EMAIL,
      });
      if (!code) {
        ErrorException(null, "USER.INVALID_OTP", HttpStatus.BAD_REQUEST);
      }
      await this.userVerificationRepository.deleteOtpById(code._id);

      await this.userRepository.updateOne({ _id: userId }, { email });
      return { message: Message(lang, "USER.CHANGED_EMAIL"), success: true };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
