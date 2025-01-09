type Role = 'user' | 'admin';

const allRoles: Record<Role, string[]> = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

const roles: Role[] = Object.keys(allRoles) as Role[];
const roleRights = new Map<Role, string[]>(Object.entries(allRoles) as [Role, string[]][]);

export { roles, roleRights };
