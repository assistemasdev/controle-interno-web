import { 
    faCalendarAlt, 
    faTools, 
    faMapMarkerAlt, 
    faClipboardList, 
    faBoxOpen, 
    faLocationArrow 
} from '@fortawesome/free-solid-svg-icons';

export const shipmentFields = [
    {
        section: "Informações do Carregamento",
        fields: [
            { 
                id: "shipment.movement_id", 
                label: "Nº Movimento", 
                type: "text", 
                icon: faCalendarAlt, 
                disabled: true,
            },
            { 
                id: "shipment.status", 
                label: "Status", 
                type: "text", 
                placeholder: "Digite o status do carregamento",
                icon: faClipboardList 
            }
        ],
    },
    {
        section: "Itens do Movimento",
        array: true,
        count: 0,
        fields: [
            { 
                id: "items.movement_item_id", 
                label: "Item do Movimento", 
                type: "multi-select", 
                placeholder: "Selecione o tipo",
                icon: faBoxOpen 
            },
            { 
                id: "items.delivery_date", 
                label: "Data de Entrega", 
                type: "date", 
                placeholder: "Selecione a data",
                icon: faCalendarAlt 
            },
            { 
                id: "items.address_id", 
                label: "Endereço", 
                type: "multi-select", 
                placeholder: "Selecione o endereço",
                icon: faMapMarkerAlt 
            },
            { 
                id: "items.location_id", 
                label: "Localização", 
                type: "multi-select", 
                placeholder: "Selecione a localização",
                notRequired: true,
                icon: faLocationArrow 
            },
            { 
                id: "items.details", 
                label: "Detalhes", 
                type: "textarea", 
                placeholder: "Digite os detalhes",
                fullWidth: true,
                icon: faTools 
            },
        ]
    },
];

export const editMovementsFields = [
    {
        section: "Informações do Carregamento",
        fields: [
            { 
                id: "status", 
                label: "Status", 
                type: "text", 
                fullWidth: true,
                icon: faClipboardList,
            }
        ],
    },
]

export const detailsMovementFields = [
    {
        section: "Informações do Carregamento",
        fields: [
            { 
                id: "movement_id", 
                label: "Nº Movimento", 
                type: "text", 
                icon: faCalendarAlt, 
                disabled: true,
            },
            { 
                id: "status", 
                label: "Status", 
                type: "text", 
                placeholder: "Digite o status do carregamento",
                icon: faClipboardList 
            }
        ],
    },
]