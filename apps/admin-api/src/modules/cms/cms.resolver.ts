import { Query, Resolver } from '@nestjs/graphql';
import { CmsEntity } from '@libs/data-access';
import { CmsService } from './cms.service';

@Resolver(() => CmsEntity)
export class CmsResolver {
  constructor(private readonly cmsService: CmsService) {}

  @Query(() => [CmsEntity], { name: 'cmsContents' })
  async cmsContents() {
    return this.cmsService.cmsContents();
  }
}
