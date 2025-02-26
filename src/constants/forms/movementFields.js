import { 
    faCalendarAlt, 
    faUser, 
    faBuilding, 
    faBoxOpen, 
    faTools 
} from '@fortawesome/free-solid-svg-icons';

export const movementFields = [
    {
        section: "Informações do Movimento",
        fields: [
            { 
                id: "movement.movement_date", 
                label: "Data do Movimento", 
                type: "date", 
                icon: faCalendarAlt,
            },
            { 
                id: "movement.service_order_id", 
                label: "Ordem de Serviço", 
                type: "multi-select", 
                placeholder: "Selecione a Ordem de Serviço",
                entity: 'serviceOrder',
                column: 'id',
                columnLabel: 'id',
                columnDetails: null,
                icon: faTools
            },
            { 
                id: "movement.customer_id", 
                label: "Cliente", 
                type: "multi-select", 
                placeholder: "Selecione o cliente",
                entity: 'customer',
                column: 'id',
                columnLabel: 'id',
                columnDetails: 'name',
                icon: faUser
            },
            { 
                id: "movement.organization_id", 
                label: "Organização", 
                type: "multi-select", 
                placeholder: "Selecione a organização",
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                columnDetails: null,
                icon: faBuilding,
            },
        ],
    },
    {
        section: "Produtos",
        array: true,
        count: 0,
        fields: [
            { 
                id: "items.movement_type_id", 
                label: "Tipo de Movimento", 
                type: "multi-select", 
                placeholder: "Selecione o Tipo de Movimento",
                entity: 'movementType',
                column: 'id',
                columnLabel: 'name',
                icon: faTools
            },
            { 
                id: "items.service_order_item_id", 
                label: "Item de Ordem de Serviço", 
                type: "multi-select", 
                placeholder: "Selecione o Item da Ordem de Serviço",
                icon: faTools
            },
            { 
                id: "items.product_id", 
                label: "Produto", 
                type: "multi-select", 
                placeholder: "Selecione o Produto",
                entity: 'product',
                column: 'name',
                isUnique: true,
                columnLabel: 'number',
                columnDetails: 'name',
                icon: faBoxOpen
            },
            { 
                id: "items.item_id", 
                label: "Item", 
                type: "text", 
                placeholder: "Digite o identificador",
                icon: faBoxOpen
            },
            { 
                id: "items.old_organization_id", 
                label: "Organização Antiga", 
                type: "multi-select", 
                placeholder: "Selecione a Organização Antiga",
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                columnDetails: null,
                notRequired: true,
                icon: faBuilding
            },
            { 
                id: "items.new_organization_id", 
                label: "Organização Nova", 
                type: "multi-select", 
                placeholder: "Selecione a Organização Nova",
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                columnDetails: null,
                notRequired: true,
                icon: faBuilding
            },
        ]
    },
];

export const editMovementsFields = [
    {
        section: "Informações do Movimento",
        fields: [
            { 
                id: "movement_date", 
                label: "Data do Movimento", 
                type: "date", 
                fullWidth: true,
                icon: faCalendarAlt,
            }
        ],
    },
]

export const detailsMovementFields = [
    {
        section: "Informações do Movimento",
        fields: [
            { 
                id: "movement_date", 
                label: "Data do Movimento", 
                type: "date", 
                icon: faCalendarAlt,
            },
            { 
                id: "service_order_id", 
                label: "Ordem de Serviço", 
                type: "multi-select", 
                placeholder: "Selecione a Ordem de Serviço",
                icon: faTools
            },
            { 
                id: "customer_id", 
                label: "Cliente", 
                type: "multi-select", 
                placeholder: "Selecione o cliente",
                icon: faUser
            },
            { 
                id: "organization_id", 
                label: "Organização", 
                type: "multi-select", 
                placeholder: "Selecione a organização",
                icon: faBuilding,
            },
        ],
    },
]