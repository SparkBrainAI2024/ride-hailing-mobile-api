import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

interface propertyObj {
  key: string;
  value: any;
}

export function IsAllowedField(propertyObj: propertyObj, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsAllowedField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyObj.key],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) {
            return true;
          }
          return relatedValue === propertyObj.value;
        },
      },
    });
  };
}
