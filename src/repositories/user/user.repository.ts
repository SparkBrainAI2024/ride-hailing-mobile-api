import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorException } from 'src/common/exceptions/error.exception';
import { BaseRepository } from 'src/repositories/abstracts/base-repository';
import { User, UserDocument } from 'src/schema/user/user.schema';

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
