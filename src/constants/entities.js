function createEntityRoutes(baseUrl) {
    return {
        get: `/${baseUrl}`,
        getByColumn: (column) => `/${baseUrl}/${column}`,
        create: `/${baseUrl}`,
        update: (id) => `/${baseUrl}/${id}`,
        delete: (id) => `/${baseUrl}/${id}`,
    };
}

function createNestedRoutes(baseUrl, subPath) {
    return {
        get: (id) => id ? `/${baseUrl}/${id}/${subPath}` : `/${baseUrl}/${subPath}`,
        getByColumn: (id, column) => id && column ? `/${baseUrl}/${id}/${subPath}/${column}` : `/${baseUrl}/${id}/${subPath}`,
        create: (id) => id ? `/${baseUrl}/${id}/${subPath}` : `/${baseUrl}/${subPath}`,
        update: (id, column) => id && column ? `/${baseUrl}/${id}/${subPath}/${column}` : `/${baseUrl}/${id}/${subPath}`,
        delete: (id, column) => id && column ? `/${baseUrl}/${id}/${subPath}/${column}` : `/${baseUrl}/${id}/${subPath}`
    };
}

export const entities = {
    users: {
        ...createEntityRoutes('users'),
        permissions: createNestedRoutes('users', 'permissions')
    },
    roles: {
        ...createEntityRoutes('roles'),
        permissions: createNestedRoutes('roles', 'permissions')
    },
    permissions: createEntityRoutes('permissions'),
    applications: createEntityRoutes('applications'),
    organizations: {
        ...createEntityRoutes('organizations'),
        addresses: {
            ...createNestedRoutes('organizations', 'addresses'),
            locations: (organizationId) => createNestedRoutes(`organizations/${organizationId}/addresses`, 'locations')
        }
    },
    conditions: createEntityRoutes('conditions')
};
