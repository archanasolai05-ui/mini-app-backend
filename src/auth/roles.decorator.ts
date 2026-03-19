import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);       //store in key value pair in the metadata of the route handler. Key is 'roles' and value is the array of roles passed as arguments to the decorator.