import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);

export function SetRoles<T>(...roles: T[]) {
  return SetMetadata(ROLES_KEY, roles);
}
