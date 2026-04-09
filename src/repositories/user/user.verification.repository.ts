import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorException } from '../../common/exceptions/error.exception';
import { UTCTime } from '../../common/utils/datetime';
import { BaseRepository } from '../abstracts/base-repository';
import { verificationType } from '../../schema/user/user-enum';
import { UserVerification, UserVerificationDocument } from '../../schema/user/user.verification';

@Injectable()
export class UserVerificationRepository extends BaseRepository {
    constructor(
        @InjectModel(UserVerification.name)
        private userVerificationModel: Model<UserVerificationDocument>
    ) {
        super(userVerificationModel);
    }

    async deleteOtpById(id: string) {
        try {
            return await this.userVerificationModel.findByIdAndDelete(id)
        } catch (e) {
            ErrorException(e, "COMMON.INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async sendEmailVerificationOtp(userId: string | Types.ObjectId, otp: number) {
        try {
            await this.userVerificationModel.findOneAndDelete({ type: verificationType.EMAIL, userId, otp })
            return await this.create({
                type: verificationType.EMAIL,
                userId: userId,
                otp,
                createdAt: UTCTime()
            })
        } catch (e) {
            ErrorException(e, "COMMON.INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    async sendResetPasswordOtp(userId: string, otp: number) {
        try {
            await this.userVerificationModel.findOneAndDelete({ type: verificationType.EMAIL, userId, otp })
            return await this.create({
                type: verificationType.EMAIL,
                userId: userId,
                otp,
                createdAt: UTCTime()
            })
        } catch (e) {
            ErrorException(e, "COMMON.INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
