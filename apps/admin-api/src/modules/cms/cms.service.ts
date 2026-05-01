import { Injectable } from '@nestjs/common';
import { CmsRepository } from '@libs/data-access';

@Injectable()
export class CmsService {
  constructor(private readonly cmsRepository: CmsRepository) {}

  async cmsContents() {
    return this.cmsRepository.findAll();
  }
}
