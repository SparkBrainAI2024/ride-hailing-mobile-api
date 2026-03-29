import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "src/repositories/abstracts/base-repository";
import {
  UserDetails,
  UserDetailsDocument,
} from "src/schema/user/user.details.schema";

@Injectable()
export class UserDetailsRepository extends BaseRepository {
  constructor(
    @InjectModel(UserDetails.name)
    private userDetailsModel: Model<UserDetailsDocument>,
  ) {
    super(userDetailsModel);
  }

  findByEmail(email: string) {
    return this.findOne({ email });
  }
}
