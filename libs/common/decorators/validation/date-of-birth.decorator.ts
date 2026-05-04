import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

// Custom validator for DOB range
export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsValidDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true; // allow optional

          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          const now = new Date();
          const minDate = new Date();
          minDate.setFullYear(now.getFullYear() - 120);

          return date <= now && date >= minDate;
        },
        defaultMessage(args: ValidationArguments) {
          return "Date cannot be in the future or more than 120 years ago.";
        },
      },
    });
  };
}

export function IsValidFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsValidFutureDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true; // allow optional

          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          const now = new Date();
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          ); // midnight today
          const inputDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ); // midnight of input

          const maxDate = new Date();
          maxDate.setFullYear(today.getFullYear() + 20);

          return inputDate >= today && inputDate <= maxDate;
        },
        defaultMessage(args: ValidationArguments) {
          return "Date cannot be in the past.";
        },
      },
    });
  };
}
