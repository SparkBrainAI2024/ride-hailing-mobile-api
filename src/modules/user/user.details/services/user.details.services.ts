import { HttpStatus, Injectable } from "@nestjs/common";
import { ErrorException } from "src/common/exceptions/error.exception";
import { UserDetailsRepository } from "src/repositories/user/user.details.repository";
import { CreateUserDetailsInput } from "../dto/user.details.dto";
import { UserRepository } from "src/repositories/user/user.repository";

@Injectable()
export class UserDetailsService {
  constructor(
    private readonly userDetailsRepository: UserDetailsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // ✅ Update user details (based on logged-in user)
  async update(userId: string, input: CreateUserDetailsInput, lang: string) {
    try {
      const details = await this.userDetailsRepository.findOne({ userId });
      if (!details)
        return await this.userDetailsRepository.create({ userId, ...input });

      return await this.userDetailsRepository.updateOne(
        { userId },
        { ...input },
      );
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Get current user details (self)
  async findOne(userId: string, lang: string) {
    try {
      const details = await this.userDetailsRepository.findOne({ userId });
      if (!details)
        ErrorException(null, "USER.DETAILS_NOT_FOUND", HttpStatus.NOT_FOUND);

      return details;
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
