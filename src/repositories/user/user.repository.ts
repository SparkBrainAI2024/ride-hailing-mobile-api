import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorException } from '../../common/exceptions/error.exception';
import { BaseRepository } from '../abstracts/base-repository';
import { User, UserDocument } from '../../schema/user/user.schema';

@Injectable()
export class UserRepository extends BaseRepository {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>
    ) {
        super(userModel);
    }

    findByEmail(email: string) {
        return this.findOne({ email });
    }

    async userCounts() {
        try {
            return await this.userModel.countDocuments()
        } catch (e) {
            ErrorException(e, "COMMON.INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
