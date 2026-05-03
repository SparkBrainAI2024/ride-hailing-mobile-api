import { SetMetadata } from '@nestjs/common';

export const StepRequired = (step) => SetMetadata('stepRequired', step);
