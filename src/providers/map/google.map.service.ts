import { HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import { ErrorException } from "../../common/exceptions/error.exception";
import { GOOGLE_MAP_API_KEY } from "src/config";

export interface NepalAddressResponse {
  province: string | null;
  district: string | null;
  localArea: string | null;
  nearLandmark: string | null;
  postalCode: string | null;
  mapPlaceId: string | null;
  fullAddress: string | null;
}

@Injectable()
export class LocationService {
  private readonly geocodeApi =
    "https://maps.googleapis.com/maps/api/geocode/json";
  private readonly placesApi =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  private readonly apiKey = GOOGLE_MAP_API_KEY;

  /**
   * Reverse geocode latitude/longitude into Nepal address with nearest landmark
   */
  async reverseGeocode(
    lat: number,
    lng: number
  ): Promise<NepalAddressResponse | null> {
    try {
      const geoUrl = `${this.geocodeApi}?latlng=${lat},${lng}&key=${this.apiKey}&language=en`;
      const { data: geoData } = await axios.get(geoUrl);

      if (!geoData.results?.length) return null;

      const address = this.extractNepalAddress(geoData);

      address.nearLandmark = await this.getNearestLandmark(lat, lng);

      return address;
    } catch (e) {
      throw ErrorException(
        e,
        "COMMON.INTERNAL_SERVER_ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Extract exact Nepal address from Geocoding API
   */
  extractNepalAddress(googleData: any) {
    const primary = googleData.results[0];
    const components = primary.address_components || [];

    const get = (type: string) =>
      components.find((c) => c.types.includes(type))?.long_name || null;

    const province = get("administrative_area_level_1");
    const district = get("administrative_area_level_2");
    const municipality =
      get("administrative_area_level_3") ||
      get("locality") ||
      get("sublocality_level_1");
    const localArea =
      get("sublocality") || get("neighborhood") || get("sublocality_level_1");

    // 🔥 Build human-readable fullAddress with your rule
    let fullAddress = "";

    if (localArea && municipality && localArea !== municipality) {
      fullAddress = `${localArea}, ${municipality}, ${district}`;
    } else {
      // When localArea and municipality are the same OR localArea is null
      fullAddress = `${municipality}, ${district}`;
    }

    return {
      province,
      district,
      localArea,
      nearLandmark: null,
      postalCode: get("postal_code"),
      mapPlaceId: primary.place_id,
      fullAddress,
    };
  }

  /**
   * Minimal Places API call to get nearest landmark
   */
  private async getNearestLandmark(lat: number, lng: number) {
    try {
      const radius = 200;
      const url = `${this.placesApi}?location=${lat},${lng}&radius=${radius}&type=point_of_interest&key=${this.apiKey}&language=en`;

      const { data } = await axios.get(url);

      if (!data.results?.length) return null;

      return data.results[0].name || null;
    } catch {
      return null;
    }
  }
}
