export const hasPermission = (userRoles, userPermissions, requiredPermission) => {
  const isSuperAdmin = userRoles.find(role => role.name === 'Super Admin');
  
  if (isSuperAdmin) {
    return true; 
  }

  const hasPermission = userPermissions.find(permission => permission.name === requiredPermission);
  return hasPermission !== undefined;
};