import { Role } from 'src/schema/users.schema';

export interface JwtPayloadInterface {
  guid: string;
  username: string;
  role: Role;
}
