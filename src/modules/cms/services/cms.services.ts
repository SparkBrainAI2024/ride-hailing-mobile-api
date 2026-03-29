import { HttpStatus } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ErrorException } from "src/common/exceptions/error.exception";
import * as countries from "countries-list";
import { CountryListType } from "../entities/cms.entity";

@Injectable()
export class CmsService {
  constructor() {}

  async countriesList() {
    try {
      const rawList = countries.countries;
      let formattedList: CountryListType[] = [];

      for (let key in rawList) {
        const country = rawList[key];

        formattedList.push({
          name: country.name,
          phoneCode: Array.isArray(country.phone)
            ? country.phone
            : [country.phone],
          symbol: key,
        });
      }

      return formattedList;
    } catch (e) {
      ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
