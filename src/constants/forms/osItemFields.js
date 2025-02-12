import { faWeightHanging, faRuler, faIdBadge, faBox, faCogs, faSortNumericUp, faMapMarkerAlt, faLocationArrow, faInfoCircle, faKey, faTags } from '@fortawesome/free-solid-svg-icons';

export const DetailsOsItemFields = [
    {
        section: "Item da Order de Serviço",
        fields: [
            { 
                id: "identify", 
                label: "Identificador", 
                type: "text", 
                icon: faIdBadge
            },
            { 
                id: "osItemType", 
                label: "Tipo de Item de OS", 
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

export const osItemFields = [
    {
        section: "Item da Order de Serviço",
        fields: [
            { 
                id: "item_id", 
                label: "Identificador", 
                type: "text", 
                placeholder:'Digite o identificador',
                icon: faKey
            },
            { 
                id: "service_order_item_type_id", 
                label: "Tipo de Item de OS", 
                type: "multi-select", 
                placeholder:'Selecione o tipo',
                entity: 'serviceOrderItemType',
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
                column: 'id',
                columnLabel: 'number',
                columnDetails: 'name',
                icon: faCogs
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
