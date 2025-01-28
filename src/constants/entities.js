// export const entities = {
//     users: {
//         get: '/users',
//         getById: (id) => `/users/${id}`,
//         create: '/users',
//         update: (id) => `/users/${id}`,
//         delete: (id) => `/users/${id}`
//     },
//     roles: 'roles',
//     applications: 'applications',
//     organizations: 'organizations',
//     conditions: 'conditions',
//     categories: 'categories',
//     customers: 'customers',
//     products: 'products',
//     suppliers: 'suppliers',
//     types: 'types',
//     groups: 'groups',
//     status: 'status',
//     units: 'units',
//     contracts: 'contracts',
//     contractTypes: 'contractTypes',
//     contractStatus: 'contractStatus',
//     contractEventTypes: 'contractEventTypes',
//     contractInfos: 'contractInfos',

// }

export const entities = {
    users: {
        ...createEntityRoutes('/users'),
        permissions: {
            getByColumn: (userColumn) => `/users/${userColumn}/permissions/`,
            update: (userColumn) => `/users/${userColumn}/permissions/`
        }
    },
    roles: {
        ...createEntityRoutes('/roles'),
        permissions: {
            getByColumn: (rolesColumn) => `/roles/${rolesColumn}/permissions/`,
            update: (rolesColumn) => `/roles/${rolesColumn}/permissions/`
        }
    },
    permissions: createEntityRoutes('/permissions'),
    applications: createEntityRoutes('/applications')

};

function createEntityRoutes(baseUrl) {
    return {
        get: `${baseUrl}`,
        getByColumn: (column) => `${baseUrl}/${column}`,
        create: `${baseUrl}`,
        update: (id) => `${baseUrl}/${id}`,
        delete: (id) => `${baseUrl}/${id}`,
    };
}
