import { Role } from '../modules/roles/entities/role.entity';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<Role>;
  deleted: boolean;
  enable: boolean;
  password: string;
}
