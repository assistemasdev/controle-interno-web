import { faClipboardCheck, faBoxOpen, faMapMarkerAlt, faCalendarAlt, faFileAlt, faToggleOn } from '@fortawesome/free-solid-svg-icons';

export const orderServiceFields = [
    {
        section: "Order de Serviço",
        fields: [
            { 
                id: "order.status_id", 
                label: "Status de OS", 
                type: "multi-select", 
                placeholder: "Selecione o status", 
                entity: 'serviceOrderStatus',
                column: 'name',
                columnLabel: 'name',
                icon: faClipboardCheck
            },
            { 
                id: "order.departament_id", 
                label: "Departamento de OS", 
                type: "multi-select", 
                entity: 'serviceOrderDepartament',
                column: 'name',
                columnLabel: 'name',
                placeholder: "Selecione o departamento", 
                icon: faClipboardCheck
            },
            { 
                id: "order.destination_id", 
                label: "Destino de OS", 
                type: "multi-select", 
                entity: 'serviceOrderDestination',
                column: 'name',
                columnLabel: 'name',
                placeholder: "Selecione o destino", 
                icon: faMapMarkerAlt
            },
            { 
                id: "order.deadline", 
                label: "Prazo Final", 
                type: "date", 
                placeholder: "Selecione a data do prazo final", 
                icon: faCalendarAlt
            },
            { 
                id: "order.details", 
                label: "Detalhes", 
                type: "textarea", 
                placeholder: "Digite o detalhes", 
                fullWidth: true,
                icon: faFileAlt
            },
        ],
    },
    {
        section: "Produtos",
        array: true,
        fields: [
            { 
                id: "items.movement_type_id", 
                label: "Tipo de Movimento", 
                type: "multi-select", 
                placeholder:"Digite o tipo de movimento",
                entity: 'movementType',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck
            },
            { 
                id: "items.item_id", 
                label: "ID", 
                type: "text", 
                placeholder:"Digite o Identificador",
                icon: faBoxOpen
            },
            { 
                id: "items.product_id", 
                label: "Produto", 
                type: "multi-select", 
                placeholder:"Digite o Produto",
                isUnique: true,
                entity: 'product',
                column: 'name',
                columnLabel: 'number',
                columnDetails: 'name',
                icon: faBoxOpen
            },
            { 
                id: "items.quantity", 
                label: "Quantidade", 
                type: "number", 
                placeholder:"Digite a Quantidade",
                icon: faBoxOpen
            },
            {
                id: "items.address_id",
                label: "Endereço", 
                type: "multi-select", 
                placeholder:"Selecione o endereço",
                icon: faMapMarkerAlt
            },
            {
                id: "items.location_id",
                label: "Localização", 
                type: "multi-select", 
                placeholder:"Selecione a localização",
                icon: faMapMarkerAlt,
                notRequired: true,
            },
            { 
                id: "items.details", 
                label: "Detalhes", 
                type: "textarea", 
                placeholder:"Digite os detalhes",
                fullWidth: true,
                icon: faFileAlt
            },
        ]
    },

];

export const DetailsOrderServiceFields = [
    {
        section: "Order de Serviço",
        fields: [
            { 
                id: "status", 
                label: "Status de OS", 
                type: "text", 
                icon: faClipboardCheck
            },
            { 
                id: "user", 
                label: "Responsável pela OS", 
                type: "text", 
                icon: faClipboardCheck
            },
            { 
                id: "departament", 
                label: "Departamento de OS", 
                type: "text", 
                icon: faClipboardCheck
            },
            { 
                id: "deadline", 
                label: "Prazo Final", 
                type: "date", 
                icon: faCalendarAlt
            },
            { 
                id: "destination", 
                label: "Destino de OS", 
                type: "text",
                fullWidth:true, 
                icon: faMapMarkerAlt
            },
            { 
                id: "details", 
                label: "Detalhes", 
                type: "textarea", 
                fullWidth: true,
                icon: faFileAlt
            },
        ],
    }
];

export const DetailsOrderServiceGlobalFields = [
    {
        section: "Order de Serviço",
        fields: [
            { 
                id: "contract", 
                label: "Contrato", 
                type: "text", 
                icon: faClipboardCheck
            },
            { 
                id: "status", 
                label: "Status de OS", 
                type: "text", 
                icon: faClipboardCheck
            },
            { 
                id: "user", 
                label: "Responsável pela OS", 
                type: "text", 
                icon: faClipboardCheck
            },
            { 
                id: "departament", 
                label: "Departamento de OS", 
                type: "text", 
                icon: faClipboardCheck
            },
            { 
                id: "deadline", 
                label: "Prazo Final", 
                type: "date", 
                icon: faCalendarAlt
            },
            { 
                id: "destination", 
                label: "Destino de OS", 
                type: "text",
                icon: faMapMarkerAlt
            },
            { 
                id: "details", 
                label: "Detalhes", 
                type: "textarea", 
                fullWidth: true,
                icon: faFileAlt
            },
        ],
    }
];


export const editOrderServiceFields = [
    {
        section: "Order de Serviço",
        fields: [
            { 
                id: "status_id", 
                label: "Status de OS", 
                type: "multi-select", 
                placeholder: "Selecione o status", 
                entity: 'serviceOrderStatus',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck
            },
            { 
                id: "departament_id", 
                label: "Departamento de OS", 
                type: "multi-select", 
                placeholder: "Selecione o departamento", 
                entity: 'serviceOrderDepartament',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck
            },
            { 
                id: "destination_id", 
                label: "Destino de OS", 
                type: "multi-select", 
                entity: 'serviceOrderDestination',
                column: 'id',
                columnLabel: 'name',
                placeholder: "Selecione o destino", 
                icon: faMapMarkerAlt
            },
            { 
                id: "deadline", 
                label: "Prazo Final", 
                type: "date", 
                placeholder: "Selecione a data do prazo final", 
                icon: faCalendarAlt
            },
            { 
                id: "details", 
                label: "Detalhes", 
                type: "textarea", 
                placeholder: "Digite o detalhes", 
                fullWidth: true,
                icon: faFileAlt
            },
        ],
    }
];

export const baseOsFields = [
    {
        section: "Order de Serviço",
        fields: [
            { 
                id: "order.status_id", 
                label: "Status de OS", 
                type: "multi-select", 
                placeholder: "Selecione o status", 
                entity: 'serviceOrderStatus',
                column: 'name',
                columnLabel: 'name',
                icon: faClipboardCheck
            },
            { 
                id: "order.departament_id", 
                label: "Departamento de OS", 
                type: "multi-select", 
                entity: 'serviceOrderDepartament',
                column: 'name',
                columnLabel: 'name',
                placeholder: "Selecione o departamento", 
                icon: faClipboardCheck
            },
            { 
                id: "order.destination_id", 
                label: "Destino de OS", 
                type: "multi-select", 
                entity: 'serviceOrderDestination',
                column: 'name',
                columnLabel: 'name',
                placeholder: "Selecione o destino", 
                icon: faMapMarkerAlt
            },
            { 
                id: "order.deadline", 
                label: "Prazo Final", 
                type: "date", 
                placeholder: "Selecione a data do prazo final", 
                icon: faCalendarAlt
            },
            { 
                id: "order.details", 
                label: "Detalhes", 
                type: "textarea", 
                placeholder: "Digite o detalhes", 
                fullWidth: true,
                icon: faFileAlt
            },
        ],
    },
    {
        section: "Produtos",
        array: true,
        fields: [
            { 
                id: "items.movement_type_id", 
                label: "Tipo de Movimento", 
                type: "multi-select", 
                placeholder:"Digite o tipo de movimento",
                entity: 'movementType',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck,
            },
            {
                id: 'items.identify',
                label: 'Identificador',
                type: 'text',
                placeholder: 'Identificador',
                icon: faToggleOn,
                disabled: true,
            }
        ]
    },

];

export const dynamicFields = {
    1: [ 
        { 
            id: "items.contract_item_id", 
            label: "Contract Item Id", 
            type: "text", 
            placeholder:"Digite o Identificador",
            icon: faBoxOpen
        },
        { 
            id: "items.quantity", 
            label: "Quantidade", 
            type: "number", 
            placeholder:"Digite a Quantidade",
            icon: faBoxOpen
        },
        {
            id: "items.address_id",
            label: "Endereço", 
            type: "multi-select", 
            placeholder:"Selecione o endereço",
            icon: faMapMarkerAlt
        },
        {
            id: "items.location_id",
            label: "Localização", 
            type: "multi-select", 
            placeholder:"Selecione a localização",
            icon: faMapMarkerAlt,
            notRequired: true,
        },
        { 
            id: "items.details", 
            label: "Detalhes", 
            type: "textarea", 
            placeholder:"Digite os detalhes",
            fullWidth: true,
            icon: faFileAlt
        },
    ],
    2: [ 
        { 
            id: "items.product_id", 
            label: "Produto", 
            type: "multi-select", 
            placeholder:"Digite o Produto",
            isUnique: true,
            entity: 'product',
            column: 'name',
            columnLabel: 'number',
            columnDetails: 'name',
            icon: faBoxOpen,
            fullWidth: true
        },
        {
            id: "items.address_id",
            label: "Endereço", 
            type: "multi-select", 
            placeholder:"Selecione o endereço",
            icon: faMapMarkerAlt
        },
        {
            id: "items.location_id",
            label: "Localização", 
            type: "multi-select", 
            placeholder:"Selecione a localização",
            icon: faMapMarkerAlt,
            notRequired: true,
        },
        { 
            id: "items.details", 
            label: "Detalhes", 
            type: "textarea", 
            placeholder:"Digite os detalhes",
            fullWidth: true,
            icon: faFileAlt
        },
    ],
    3: [ 
        { 
            id: "items.product_id", 
            label: "Produto", 
            type: "multi-select", 
            placeholder:"Digite o Produto",
            isUnique: true,
            entity: 'product',
            column: 'name',
            columnLabel: 'number',
            columnDetails: 'name',
            icon: faBoxOpen,
            fullWidth: true
        },
        { 
            id: "items.details", 
            label: "Detalhes", 
            type: "textarea", 
            placeholder:"Digite os detalhes",
            fullWidth: true,
            icon: faFileAlt
        },
    ]
};
