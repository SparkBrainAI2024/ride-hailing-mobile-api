import { Resolver, Query } from "@nestjs/graphql";
import { CmsService } from "../services/cms.services";
import { CountryListType } from "../entities/cms.entity";

@Resolver()
export class CmsResolver {
  constructor(private readonly cmsService: CmsService) {}

  @Query(() => [CountryListType], { name: "countriesList" })
  async countriesList() {
    return this.cmsService.countriesList();
  }
}
