import { 
    faBuilding, 
    faBoxOpen, 
    faTools 
} from '@fortawesome/free-solid-svg-icons';

export const movementItemFields = [
    {
        section: "Produtos",
        fields: [
            { 
                id: "movement_type_id", 
                label: "Tipo de Movimento", 
                type: "multi-select", 
                placeholder: "Selecione o tipo",
                entity: 'movementType',
                column: 'id',
                columnLabel: 'name',
                icon: faTools
            },
            { 
                id: "service_order_item_id", 
                label: "Item de Ordem de Serviço", 
                type: "multi-select", 
                placeholder: "Selecione o Item da Ordem de Serviço",
                icon: faTools
            },
            { 
                id: "product_id", 
                label: "Produto", 
                type: "multi-select", 
                placeholder: "Selecione o Produto",
                entity: 'product',
                column: 'id',
                columnLabel: 'number',
                columnDetails: 'name',
                icon: faBoxOpen
            },
            { 
                id: "item_id", 
                label: "Item", 
                type: "text", 
                placeholder: "Digite o identificador",
                icon: faBoxOpen
            },
            { 
                id: "old_organization_id", 
                label: "Organização Antiga", 
                type: "multi-select", 
                placeholder: "Selecione a Organização Antiga",
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                notRequired: true,
                icon: faBuilding
            },
            { 
                id: "new_organization_id", 
                label: "Organização Nova", 
                type: "multi-select", 
                placeholder: "Selecione a Organização Nova",
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                notRequired: true,
                icon: faBuilding
            },
        ]
    },
]

export const detailsMovementItemFields = [
    {
        section: "Produto",
        fields: [
            { 
                id: "movement_type_id", 
                label: "Tipo de Movimento", 
                type: "text", 
                placeholder: "Selecione o tipo",
                icon: faTools
            },
            { 
                id: "service_order_item_id", 
                label: "Item de Ordem de Serviço", 
                type: "text", 
                placeholder: "Selecione o Item da Ordem de Serviço",
                icon: faTools
            },
            { 
                id: "product_id", 
                label: "Produto", 
                type: "text", 
                placeholder: "Selecione o Produto",
                icon: faBoxOpen
            },
            { 
                id: "item_id", 
                label: "Item", 
                type: "text", 
                placeholder: "Digite o identificador",
                icon: faBoxOpen
            },
            { 
                id: "old_organization_id", 
                label: "Organização Antiga", 
                type: "text", 
                placeholder: "Selecione a Organização Antiga",
                notRequired: true,
                icon: faBuilding
            },
            { 
                id: "new_organization_id", 
                label: "Organização Nova", 
                type: "text", 
                placeholder: "Selecione a Organização Nova",
                notRequired: true,
                icon: faBuilding
            },
        ]
    },
]