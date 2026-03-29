import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ErrorException } from "src/common/exceptions/error.exception";
import { BaseRepository } from "src/repositories/abstracts/base-repository";
import { Device, DeviceDocument } from "src/schema/user/device.schema";

@Injectable()
export class DeviceRepository extends BaseRepository {
  constructor(
    @InjectModel(Device.name)
    private deviceModel: Model<DeviceDocument>
  ) {
    super(deviceModel);
  }

  async findByUserId(userId: string) {
    return await this.findOne({ userId });
  }

  async findByDeviceId(deviceId: string) {
    return await this.findOne({ deviceId });
  }

  async addDevice(
    userId: string | Types.ObjectId,
    deviceId: string,
    firebaseToken: string,
    deviceType: string | null
  ) {
    return await this.create({
      userId,
      deviceId,
      firebaseToken,
      deviceType,
    });
  }

  async logout(userId: string, deviceId: string) {
    const device = await this.findOne({ userId, deviceId });
    if (!device)
      ErrorException(null, "USER.DEVICE_NOT_FOUND", HttpStatus.BAD_REQUEST);
    return this.deleteOne({ userId, deviceId });
  }
}
