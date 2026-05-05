import { BadRequestException } from '@nestjs/common';
import * as mongoose from 'mongoose';

export const toMongoObjectId = (param: { value: string; key: string }) => {
  const { value, key } = param;
  if (!mongoose.isValidObjectId(value)) {
    throw new BadRequestException(`Invalid ${key} value`);
  }
  return new mongoose.Types.ObjectId(value);
};

export const toMongoId = (id: string) => {
  return new mongoose.Types.ObjectId(id);
};

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
