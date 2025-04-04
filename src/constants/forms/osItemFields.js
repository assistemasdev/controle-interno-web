import { faWeightHanging, faRuler, faIdBadge, faBox, faCogs, faSortNumericUp, faMapMarkerAlt, faLocationArrow, faInfoCircle, faKey, faTags } from '@fortawesome/free-solid-svg-icons';

export const DetailsOsItemFields = [
    {
        section: "Item da Order de Serviço",
        fields: [
            { 
                id: "identify", 
                label: "Item Id", 
                type: "text", 
                icon: faIdBadge
            },
            { 
                id: "movementType", 
                label: "Tipo de Movimento", 
                type: "text", 
                icon: faBox
            },
            { 
                id: "product", 
                label: "Produto", 
                type: "text", 
                icon: faCogs
            },
            { 
                id: "quantity", 
                label: "Quantidade", 
                type: "number", 
                icon: faSortNumericUp
            },
            { 
                id: "address", 
                label: "Endereço", 
                type: "text",
                icon: faMapMarkerAlt
            },
            { 
                id: "location", 
                label: "Localização", 
                type: "text",
                icon: faLocationArrow
            },
            { 
                id: "details", 
                label: "Detalhes", 
                type: "textarea", 
                fullWidth: true,
                icon: faInfoCircle
            },
        ],
    }
];

export const baseOsItemFields = [
    {
        section: "Item da Order de Serviço",
        fields: [
            { 
                id: "movement_type_id", 
                label: "Tipo de Movimento", 
                type: "multi-select", 
                placeholder:'Selecione o tipo',
                entity: 'movementType',
                column: 'id',
                columnLabel: 'name',
                icon: faTags,
                fullWidth: true,
                disabled: true
            },
        ]
    }
];

export const dynamicFields = {
    1: [ 
        { 
            id: "contract_item_id", 
            label: "Contract Item Id", 
            type: "text", 
            placeholder:'Digite o identificador',
            icon: faKey
        },
        { 
            id: "quantity", 
            label: "Quantidade", 
            type: "number", 
            placeholder:'Digite a quantidade',
            icon: faSortNumericUp
        },
        { 
            id: "address_id", 
            label: "Endereço", 
            type: "multi-select",
            placeholder:'Selecione o endereço',
            icon: faMapMarkerAlt
        },
        { 
            id: "location_id", 
            label: "Localização", 
            type: "multi-select",
            placeholder:'Selecione a localização',
            icon: faLocationArrow
        },
        { 
            id: "details", 
            label: "Detalhes", 
            type: "textarea", 
            fullWidth: true,
            placeholder:'Digite os detalhes',
            icon: faInfoCircle
        },
    ],
    2: [ 
        { 
            id: "product_id", 
            label: "Produto", 
            type: "multi-select", 
            placeholder:'Selecione o produto',
            entity: 'product',
            column: 'number',
            columnLabel: 'number',
            columnDetails: 'name',
            icon: faCogs,
            fullWidth: true
        },
        { 
            id: "details", 
            label: "Detalhes", 
            type: "textarea", 
            fullWidth: true,
            placeholder:'Digite os detalhes',
            icon: faInfoCircle
        },
    ],
    3: [ 
        { 
            id: "product_id", 
            label: "Produto", 
            type: "multi-select", 
            placeholder:'Selecione o produto',
            entity: 'product',
            column: 'number',
            columnLabel: 'number',
            columnDetails: 'name',
            icon: faCogs,
            fullWidth: true
        },
        { 
            id: "details", 
            label: "Detalhes", 
            type: "textarea", 
            fullWidth: true,
            placeholder:'Digite os detalhes',
            icon: faInfoCircle
        },
    ]
};

export const osItemFields = [
    {
        section: "Item da Order de Serviço",
        fields: [
            { 
                id: "movement_type_id", 
                label: "Tipo de Movimento", 
                type: "multi-select", 
                placeholder:'Selecione o tipo',
                entity: 'movementType',
                column: 'id',
                columnLabel: 'name',
                icon: faTags
            },
            { 
                id: "product_id", 
                label: "Produto", 
                type: "multi-select", 
                placeholder:'Selecione o produto',
                entity: 'product',
                column: 'number',
                columnLabel: 'number',
                columnDetails: 'name',
                icon: faCogs
            },
            { 
                id: "contract_item_id", 
                label: "Contract Item Id", 
                type: "text", 
                placeholder:'Digite o identificador',
                icon: faKey
            },
            { 
                id: "quantity", 
                label: "Quantidade", 
                type: "number", 
                placeholder:'Digite a quantidade',
                icon: faSortNumericUp
            },
            { 
                id: "address_id", 
                label: "Endereço", 
                type: "multi-select",
                placeholder:'Selecione o endereço',
                icon: faMapMarkerAlt
            },
            { 
                id: "location_id", 
                label: "Localização", 
                type: "multi-select",
                placeholder:'Selecione a localização',
                icon: faLocationArrow
            },
            { 
                id: "details", 
                label: "Detalhes", 
                type: "textarea", 
                fullWidth: true,
                placeholder:'Digite os detalhes',
                icon: faInfoCircle
            },
        ],
    }
];
