import { initContract } from '@ts-rest/core';
import { authContract } from './auth';
import { usersContract } from './users';
import { rolesContract } from './roles';
import { permissionsContract } from './permissions';

const c = initContract();

export const api = c.router(
  {
    auth: authContract,
    users: usersContract,
    roles: rolesContract,
    permissions: permissionsContract,
  },
  { pathPrefix: '/api' },
);
