import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CmsDocument, CmsEntity } from '../entities/cms.entity';

@Injectable()
export class CmsRepository {
  constructor(@InjectModel(CmsEntity.name) private readonly model: Model<CmsDocument>) {}

  async findAll(): Promise<CmsEntity[]> {
    return this.model.find().lean();
  }
}
