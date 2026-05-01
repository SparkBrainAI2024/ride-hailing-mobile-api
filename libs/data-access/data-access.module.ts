import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsEntity, CmsSchema } from './entities/cms.entity';
import { CmsRepository } from './repositories/cms.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: CmsEntity.name, schema: CmsSchema }])],
  providers: [CmsRepository],
  exports: [CmsRepository, MongooseModule],
})
export class DataAccessModule {}
