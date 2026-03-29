import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAllowedExt(validationOptions?: ValidationOptions, allowedExtensions = []) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsAllowedExt',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const ext = value?.split('.')[1];
          if (!ext || !allowedExtensions.includes(ext.toLowerCase())) {
            return false;
          }
          return true;
        },
      },
    });
  };
}
