import { registerDecorator, ValidationOptions, ValidationArguments, isPhoneNumber } from 'class-validator';
export function IsValidPhoneNumber(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsValidPhoneNumber',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          // return /^\+61\s\d{3}\s\d{3}\s\d{3}$/.test(value);
          return isPhoneNumber(value);
        },
      },
    });
  };
}
