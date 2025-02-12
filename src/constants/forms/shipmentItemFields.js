import { 
    faCalendarAlt, 
    faClipboardList, 
    faMapMarkerAlt, 
    faHome, 
    faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';

export const shipmentItemFields = [
    {
        section: "Informações do Item do Carregamento",
        fields: [
            { 
                id: "movement_item_id", 
                label: "Nº Movimento Item", 
                type: "multi-select", 
                icon: faClipboardList, 
                placeholder: "Selecione o Nº do Movimento Item",
            },
            { 
                id: "delivery_date", 
                label: "Data de Entrega", 
                type: "date", 
                placeholder: "Selecione a Data de Entrega",
                icon: faCalendarAlt,
            },
            { 
                id: "address_id", 
                label: "Endereço", 
                type: "multi-select", 
                icon: faHome, 
                placeholder: "Selecione o Endereço",
            },
            { 
                id: "location_id", 
                label: "Localização", 
                type: "multi-select", 
                icon: faMapMarkerAlt, 
                placeholder: "Selecione a Localização",
            },
            { 
                id: "details", 
                label: "Detalhes", 
                type: "textarea", 
                placeholder: "Digite os detalhes",
                icon: faInfoCircle, 
                fullWidth: true
            },
        ],
    }
];


export const detailsShipmentItemFields = [
    {
        section: "Informações do Item do Carregamento",
        fields: [
            { 
                id: "movement_item_id", 
                label: "Nº Movimento Item", 
                type: "text", 
                icon: faClipboardList, 
                placeholder: "Selecione o Nº do Movimento Item",
            },
            { 
                id: "delivery_date", 
                label: "Data de Entrega", 
                type: "text", 
                placeholder: "Selecione a Data de Entrega",
                icon: faCalendarAlt,
            },
            { 
                id: "address_id", 
                label: "Endereço", 
                type: "text", 
                icon: faHome, 
                placeholder: "Selecione o Endereço",
            },
            { 
                id: "location_id", 
                label: "Localização", 
                type: "text", 
                icon: faMapMarkerAlt, 
                placeholder: "Selecione a Localização",
            },
            { 
                id: "details", 
                label: "Detalhes", 
                type: "textarea", 
                placeholder: "Digite os detalhes",
                icon: faInfoCircle, 
                fullWidth: true
            },
        ],
    }
];
