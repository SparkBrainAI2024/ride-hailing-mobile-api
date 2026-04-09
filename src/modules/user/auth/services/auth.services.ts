import { HttpStatus } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ErrorException } from "../../common/exceptions/error.exception";
import { comparePassword, hashPassword } from "src/common/utils/bcrypt";
import { UTCTime } from "src/common/utils/datetime";
import {
  generateMongoDbId,
  GenerateRandomDigit,
} from "src/common/utils/id.generator";
import { generateToken, verifyToken } from "src/common/utils/jwt";
import {
  ACCESS_TOKEN_LIFE,
  JWT_SECRET_KEY,
  REFRESH_TOKEN_LIFE,
  RESET_PASSWORD_TOKEN_LIFE,
} from "src/config";
import { passwordSalt, tokenTypes, userOtpSalt } from "src/config/variable";
import { MailService } from "src/providers/mail/mail.service";
import { UserRepository } from "src/repositories/user/user.repository";
import { UserVerificationRepository } from "src/repositories/user/user.verification.repository";
import { verificationType } from "src/schema/user/user-enum";
import { UserDocument } from "src/schema/user/user.schema";
import {
  ResetPasswordInput,
  SendVerifyEmailOTPInput,
  SetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
  VerifyResetPasswordOTPInput,
} from "../dto/auth.dto";
import { Message } from "src/common/localiazation";
import { DeviceRepository } from "src/repositories/user/device.repository";
import { UserDetailsRepository } from "src/repositories/user/user.details.repository";
import { UserDetailsDocument } from "src/schema/user/user.details.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userVerificationRepository: UserVerificationRepository,
    private readonly mailService: MailService,
    private readonly deviceRepository: DeviceRepository,
    private readonly userDetailsRepository: UserDetailsRepository,
  ) {}

  async signup(createUserInput: SignUpInput, lang: string) {
    try {
      const { email, fullName, gender, phone } = createUserInput;
      const userExistWithThisEmail =
        await this.userRepository.findByEmail(email);
      if (userExistWithThisEmail?.password) {
        ErrorException(null, "USER.USED_EMAIL", HttpStatus.BAD_REQUEST);
      }
      const verificationCode = GenerateRandomDigit(userOtpSalt);
      const userTokenData = {
        email: email,
        type: tokenTypes.accessToken,
      };
      const userToken = await generateToken(userTokenData, JWT_SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_LIFE,
      });
      if (userExistWithThisEmail) {
        await this.mailService.sendUserConfirmation(email, verificationCode);
        await this.userVerificationRepository.sendEmailVerificationOtp(
          userExistWithThisEmail._id,
          verificationCode,
        );
        return {
          message: Message(lang, "USER.USER_CREATED"),
          success: true,
          userToken,
        };
      }
      const sendMail = await this.mailService.sendUserConfirmation(
        email,
        verificationCode,
      );
      if (sendMail) {
        const user: UserDocument = await this.userRepository.create({
          email,
          phone,
        });
        await this.userDetailsRepository.create({
          userId: user._id,
          gender,
          fullName,
        });
        await this.userVerificationRepository.sendEmailVerificationOtp(
          user._id,
          verificationCode,
        );
        return {
          message: Message(lang, "USER.USER_CREATED"),
          success: true,
          userToken,
        };
      } else {
        ErrorException(
          null,
          "USER.CAN_NOT_SEND_MAIL",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setPassword(setPasswordInput: SetPasswordInput, lang: string) {
    try {
      const { password, confirmPassword, userToken } = setPasswordInput;
      if (password !== confirmPassword) {
        ErrorException(
          null,
          "USER.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH",
          HttpStatus.BAD_REQUEST,
        );
      }
      const verifiedToken = await verifyToken(userToken, JWT_SECRET_KEY);
      if (!verifiedToken) {
        ErrorException(null, "COMMON.INVALID_TOKEN", HttpStatus.BAD_REQUEST);
      }
      if (verifiedToken.type !== tokenTypes.accessToken) {
        ErrorException(null, "COMMON.INVALID_TOKEN", HttpStatus.BAD_REQUEST);
      }
      const user: UserDocument = await this.userRepository.findOne({
        email: verifiedToken.email,
      });
      if (!user) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.UNAUTHORIZED);
      }
      await this.userRepository.updateOne(
        { _id: user._id },
        { password: await hashPassword(password, passwordSalt) },
      );
      return {
        message: Message(lang, "USER.PASSWORD_SET_SUCCESS"),
        success: true,
      };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(signInInput: SignInInput) {
    try {
      const { email, password, device } = signInInput;
      const user: UserDocument = await this.userRepository.findByEmail(email);
      if (!user) {
        ErrorException(null, "USER.INVALID_EMAIL", HttpStatus.UNAUTHORIZED);
      }
      const userDetails: UserDetailsDocument =
        await this.userDetailsRepository.findOne({ userId: user._id });

      if (!userDetails) {
        ErrorException(null, "USER.INVALID_EMAIL", HttpStatus.UNAUTHORIZED);
      }
      const checkPassword = await comparePassword(password, user.password);
      if (!checkPassword) {
        ErrorException(
          null,
          "USER.INCORRECT_PASSWORD",
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (user.suspended) {
        ErrorException(null, "USER.SUSPENDED", HttpStatus.UNAUTHORIZED);
      }
      await this.userRepository.updateOne(
        { _id: user._id },
        {
          lastLogin: UTCTime(),
        },
      );
      const accessTokenData = {
        id: user._id,
        email: user.email,
        sessionId: generateMongoDbId(),
        type: tokenTypes.accessToken,
      };
      const refreshTokenData = {
        id: user._id,
        email: user.email,
        type: tokenTypes.refreshToken,
      };
      const accessToken = await generateToken(accessTokenData, JWT_SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_LIFE,
      });
      const refreshToken = await generateToken(
        refreshTokenData,
        JWT_SECRET_KEY,
        { expiresIn: REFRESH_TOKEN_LIFE },
      );

      if (device) {
        const { deviceId, firebaseToken, deviceType } = device;
        await this.deviceRepository.addDevice(
          user._id,
          deviceId,
          firebaseToken,
          deviceType,
        );
      }
      const result = {
        user: {
          _id: user._id,
          email: user.email,
          phone: user.phone,
          verified: user.verified,
          language: user.language,
          suspended: user.suspended,
          loginAs: user.loginAs,
        },
        userDetails: {
          fullName: userDetails.fullName,
          address: userDetails.address,
          profileImage: userDetails.profileImage,
          dateOfBirth: userDetails.dateOfBirth,
          bio: userDetails.bio,
          gender: userDetails.gender,
          createdAt: userDetails.createdAt,
          geoLocation: userDetails?.geoLocation?.type
            ? userDetails.geoLocation
            : null,
        },
        accessToken,
        refreshToken,
      };
      console.log(result);
      return result;
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendVerifyEmailOtp(
    sendOtpInput: SendVerifyEmailOTPInput,
    lang: string,
  ) {
    try {
      const { email } = sendOtpInput;
      const user: UserDocument = await this.userRepository.findByEmail(email);
      if (!user) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.NOT_FOUND);
      }
      const verificationCode = GenerateRandomDigit(userOtpSalt);
      const sendMail = await this.mailService.sendUserConfirmation(
        email,
        verificationCode,
      );
      if (sendMail) {
        await this.userVerificationRepository.sendEmailVerificationOtp(
          user._id,
          verificationCode,
        );
        return { message: Message(lang, "USER.OTP_SEND"), success: true };
      } else {
        ErrorException(
          null,
          "USER.CAN_NOT_SEND_MAIL",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(verifyEmaillInput: VerifyEmailInput, lang: string) {
    try {
      const { email, otp } = verifyEmaillInput;
      const user: UserDocument = await this.userRepository.findByEmail(email);
      if (!user) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.NOT_FOUND);
      }

      if (user.verified) {
        ErrorException(
          null,
          "USER.USER_ALREADY_VERIFIED",
          HttpStatus.BAD_REQUEST,
        );
      }
      const code = await this.userVerificationRepository.findOne({
        userId: user._id,
        otp,
        type: verificationType.EMAIL,
      });
      if (!code) {
        ErrorException(null, "USER.INVALID_OTP", HttpStatus.BAD_REQUEST);
      }
      await this.userRepository.updateOne(
        { _id: user._id },
        {
          verified: true,
        },
      );
      await this.userVerificationRepository.deleteOtpById(code._id);
      return {
        message: Message(lang, "USER.USER_VERIFICATION_SUCCESS"),
        success: true,
      };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyResetPasswordOTP(
    verifyOTPlInput: VerifyResetPasswordOTPInput,
    lang: string,
  ) {
    try {
      const { email, otp } = verifyOTPlInput;
      const user: UserDocument = await this.userRepository.findByEmail(email);
      if (!user) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.NOT_FOUND);
      }
      const code = await this.userVerificationRepository.findOne({
        userId: user._id,
        otp,
        type: verificationType.EMAIL,
      });
      if (!code) {
        ErrorException(null, "USER.INVALID_OTP", HttpStatus.BAD_REQUEST);
      }
      const resetPasswordToken = await generateToken(
        {
          id: user._id,
          email: user.email,
          type: tokenTypes.resetPasswordToken,
        },
        JWT_SECRET_KEY,
        { expiresIn: RESET_PASSWORD_TOKEN_LIFE },
      );
      await this.userVerificationRepository.deleteOtpById(code._id);
      return {
        message: Message(lang, "USER.USER_VERIFICATION_SUCCESS"),
        success: true,
        resetPasswordToken,
      };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginWithRefreshToken(refreshTokenInput: string) {
    try {
      const verifiedToken = await verifyToken(
        refreshTokenInput,
        JWT_SECRET_KEY,
      );
      if (!verifiedToken) {
        ErrorException(null, "COMMON.INVALID_TOKEN", HttpStatus.BAD_REQUEST);
      }
      if (verifiedToken.type !== tokenTypes.refreshToken) {
        ErrorException(null, "COMMON.INVALID_TOKEN", HttpStatus.BAD_REQUEST);
      }
      const user: UserDocument = await this.userRepository.findOne({
        _id: verifiedToken.id,
      });
      const userDetails: UserDetailsDocument =
        await this.userDetailsRepository.findOne({
          userId: user._id,
        });
      if (!user || !userDetails) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.UNAUTHORIZED);
      }
      if (user.suspended) {
        ErrorException(null, "USER.SUSPENDED", HttpStatus.UNAUTHORIZED);
      }
      await this.userRepository.updateOne(
        { _id: user._id },
        {
          lastLogin: UTCTime(),
        },
      );
      const accessTokenData = {
        id: user._id,
        email: user.email,
        sessionId: generateMongoDbId(),
        type: tokenTypes.accessToken,
      };
      const refreshTokenData = {
        id: user._id,
        email: user.email,
        type: tokenTypes.refreshToken,
      };
      const accessToken = await generateToken(accessTokenData, JWT_SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_LIFE,
      });
      const refreshToken = await generateToken(
        refreshTokenData,
        JWT_SECRET_KEY,
        { expiresIn: REFRESH_TOKEN_LIFE },
      );
      return {
        user: {
          _id: user._id,
          email: user.email,
          phone: user.phone,
          verified: user.verified,
          language: user.language,
          suspended: user.suspended,
          loginAs: user.loginAs,
        },
        userDetails: {
          fullName: userDetails.fullName,
          address: userDetails.address,
          profileImage: userDetails.profileImage,
          dateOfBirth: userDetails.dateOfBirth,
          bio: userDetails.bio,
          gender: userDetails.gender,
          createdAt: userDetails.createdAt,
          geoLocation: userDetails?.geoLocation?.type
            ? userDetails.geoLocation
            : null,
        },
        accessToken,
        refreshToken,
      };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput, lang: string) {
    try {
      const { password, resetPasswordToken } = resetPasswordInput;

      const verifiedToken = await verifyToken(
        resetPasswordToken,
        JWT_SECRET_KEY,
      );
      if (!verifiedToken) {
        ErrorException(null, "COMMON.INVALID_TOKEN", HttpStatus.BAD_REQUEST);
      }
      if (verifiedToken.type !== tokenTypes.resetPasswordToken) {
        ErrorException(null, "COMMON.INVALID_TOKEN", HttpStatus.BAD_REQUEST);
      }
      const user: UserDocument = await this.userRepository.findOne({
        _id: verifiedToken.id,
      });
      if (!user) {
        ErrorException(null, "USER.NOT_FOUND", HttpStatus.UNAUTHORIZED);
      }
      if (user.suspended) {
        ErrorException(null, "USER.SUSPENDED", HttpStatus.UNAUTHORIZED);
      }
      await this.userRepository.updateOne(
        { _id: user._id },
        { password: await hashPassword(password, passwordSalt) },
      );
      return { message: Message(lang, "USER.PASSWORD_UPDATED"), success: true };
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
