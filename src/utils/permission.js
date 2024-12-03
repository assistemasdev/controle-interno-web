export const hasPermission = (userRoles, userPermissions, requiredPermission) => {
    const isSuperAdmin = userRoles.some(role => role.name === 'Super Admin');
    
    if (isSuperAdmin) {
      return true; 
    }
  
    const hasPermission = userPermissions.some(permission => permission.name === requiredPermission);
    return hasPermission;
};
  