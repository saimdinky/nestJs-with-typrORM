import { Role } from '../modules/roles/entities/role.entity';

export interface IJwtPayload {
  id: number;
  email: string;
  roles: Role[];
  permissions: Record<
    string,
    {
      roleId: number;
      roleName: string;
      permission: {
        id: number;
        name: string;
        url: string;
        regex: string;
      };
    }
  >;
}
