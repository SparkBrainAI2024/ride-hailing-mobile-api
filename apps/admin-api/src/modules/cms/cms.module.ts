import { Module } from '@nestjs/common';
import { DataAccessModule } from '@libs/data-access';
import { CmsResolver } from './cms.resolver';
import { CmsService } from './cms.service';

@Module({
  imports: [DataAccessModule],
  providers: [CmsResolver, CmsService],
})
export class CmsModule {}
