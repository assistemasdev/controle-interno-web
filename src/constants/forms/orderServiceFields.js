import { faClipboardCheck, faBoxOpen, faMapMarkerAlt, faCalendarAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';

export const orderServiceFields = [
    {
        section: "Order de Serviço",
        fields: [
            { 
                id: "order.status_id", 
                label: "Status de OS", 
                type: "multi-select", 
                placeholder: "Selecione o status", 
                icon: faClipboardCheck
            },
            { 
                id: "order.departament_id", 
                label: "Departamento de OS", 
                type: "multi-select", 
                placeholder: "Selecione o departamento", 
                icon: faClipboardCheck
            },
            { 
                id: "order.destination_id", 
                label: "Destino de OS", 
                type: "multi-select", 
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
                id: "items.service_order_item_type_id", 
                label: "Tipo de Item de OS", 
                type: "multi-select", 
                placeholder:"Digite a Descrição",
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
                placeholder:"Digite a Descrição",
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
                icon: faMapMarkerAlt
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

export const editOrderServiceFields = [
    {
        section: "Order de Serviço",
        fields: [
            { 
                id: "status_id", 
                label: "Status de OS", 
                type: "multi-select", 
                placeholder: "Selecione o status", 
                icon: faClipboardCheck
            },
            { 
                id: "departament_id", 
                label: "Departamento de OS", 
                type: "multi-select", 
                placeholder: "Selecione o departamento", 
                icon: faClipboardCheck
            },
            { 
                id: "destination_id", 
                label: "Destino de OS", 
                type: "multi-select", 
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
