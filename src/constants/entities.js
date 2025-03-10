function createEntityRoutes(baseUrl) {
    return {
        get: `/${baseUrl}`,
        getByColumn: (column) => `/${baseUrl}/${column}`,
        create: `/${baseUrl}`,
        update: (id) => `/${baseUrl}/${id}`,
        delete: (id) => `/${baseUrl}/${id}`,
    };
}

function createNestedRoutes(baseUrl, subPath, subPathBeforeId = false) {
    return {
        get: (id) =>
            subPathBeforeId
                ? `/${baseUrl}/${subPath}${id ? `/${id}` : ''}`
                : `/${baseUrl}${id ? `/${id}` : ''}/${subPath}`,
        getByColumn: (id, column) =>
            subPathBeforeId
                ? `/${baseUrl}/${subPath}${column ? `/${column}` : ''}`
                : `/${baseUrl}${id ? `/${id}` : ''}/${subPath}${column ? `/${column}` : ''}`,
        create: (id) =>
            subPathBeforeId
                ? `/${baseUrl}/${subPath}`
                : `/${baseUrl}${id ? `/${id}` : ''}/${subPath}`,
        update: (id, column) =>
            subPathBeforeId
                ? `/${baseUrl}/${subPath}${column ? `/${column}` : ''}`
                : `/${baseUrl}${id ? `/${id}` : ''}/${subPath}${column ? `/${column}` : ''}`,
        delete: (id, column) =>
            subPathBeforeId
                ? `/${baseUrl}/${subPath}${column ? `/${column}` : ''}`
                : `/${baseUrl}${id ? `/${id}` : ''}/${subPath}${column ? `/${column}` : ''}`,
    };
}

export const entities = {
    login: createEntityRoutes('login'),
    logout: createEntityRoutes('logout'),
    users: {
        ...createEntityRoutes('users'),
        permissions: createNestedRoutes('users', 'permissions'),
        roles: createNestedRoutes('users', 'roles'),
        applications: {
            ...createNestedRoutes('users', 'applications'),
        },
        applicationsAndOrganizations: (userColumn) => createNestedRoutes(`users/${userColumn}/applications`, 'organizations')
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
    conditions: createEntityRoutes('conditions'),
    categories: createEntityRoutes('categories'),
    customers: {
        ...createEntityRoutes('customers'),
        addresses: {
            ...createNestedRoutes('customers', 'addresses'),
            locations: (customerId) => createNestedRoutes(`customers/${customerId}/addresses`, 'locations')
        },
        contacts: createNestedRoutes('customers', 'contacts'),
    },
    products: {
        ...createEntityRoutes('products'),
        groups: createNestedRoutes('products', 'groups')
    },
    status: createEntityRoutes('status'),
    suppliers: {
        ...createEntityRoutes('suppliers'),
        addresses: createNestedRoutes('suppliers', 'addresses'),
        contacts: createNestedRoutes('suppliers', 'contacts'),
    },
    types: {
        ...createEntityRoutes('types'),
        groups: createNestedRoutes('types','groups')
    },
    groups: createEntityRoutes('groups'),
    units: {
        ...createEntityRoutes('units'),
        units: createNestedRoutes('units', 'units')
    },
    contracts: {
        ...createEntityRoutes('contracts'),
        infos: createNestedRoutes('contracts', 'infos'),
        events: {
            ...createNestedRoutes('contracts', 'events'),
            additives:(contractId, eventId) => createNestedRoutes(`contracts/${contractId}/events/${eventId}`, 'additives'),
            infos: (contractId) => createNestedRoutes(`contracts/${contractId}/events`, 'infos'),
            items: (contractId) => createNestedRoutes(`contracts/${contractId}/events`, 'items'),
            jobs: (contractId) => createNestedRoutes(`contracts/${contractId}/events`, 'jobs'),
        },
        types: createNestedRoutes('contracts', 'types', true),
        status: createNestedRoutes('contracts', 'status', true),
        eventsTypes: createNestedRoutes('contracts', 'events/types', true),
        orders: {
            ...createNestedRoutes('contracts', 'orders'),
            items: (contractId) => createNestedRoutes(`contracts/${contractId}/orders`, 'items')
        },
        items:createNestedRoutes('contracts', 'items'),
        jobs:createNestedRoutes('contracts', 'jobs'),
    },
    movements: {
        ...createEntityRoutes('movements'),
        items: createNestedRoutes('movements', 'items'),
        shipments: {
            ...createNestedRoutes('movements', 'shipments'),
            items: (movementId) => createNestedRoutes(`movements/${movementId}/shipments`, 'items')
        },
        types: createNestedRoutes('movements', 'types', true),
    },
    orders: {
        ...createEntityRoutes('orders'),
        departaments: createNestedRoutes('orders', 'departaments', true),
        destinations: createNestedRoutes('orders', 'destinations', true),
        status: createNestedRoutes('orders', 'status', true),
        items: createNestedRoutes('orders', 'items')
    },
    shipments: {
        ...createEntityRoutes('shipments'),
        items: createNestedRoutes('shipments', 'items')
    },
    addresses: {
        ...createEntityRoutes('addresses'),
        locations: createNestedRoutes('addresses', 'locations')
    },
    additives: createEntityRoutes('additives')
};
