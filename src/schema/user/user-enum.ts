import { registerEnumType } from "@nestjs/graphql";

export enum roles {
  USER = "USER",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
}

export enum language {
  EN = "EN",
  NP = "NP",
}

export enum gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHERS = "OTHERS",
  UNPUBLISHED = "UNPUBLISHED",
}

export enum verificationType {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
}

export enum deviceType {
  IOS = "IOS",
  ANDROID = "ANDROID",
  WEB = "WEB",
}

// Registering for GraphQL
registerEnumType(roles, { name: "Roles" });
registerEnumType(language, { name: "Language" });
registerEnumType(gender, { name: "Gender" });
registerEnumType(verificationType, { name: "VerificationType" });
registerEnumType(deviceType, { name: "DeviceType" });
