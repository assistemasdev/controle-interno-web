export const DetailsOsItemFields = [
    {
        section: "Item da Order de Serviço",
        fields: [
            { 
                id: "identify", 
                label: "Identificador:", 
                type: "text", 
            },
            { 
                id: "osItemType", 
                label: "Tipo de Item de OS:", 
                type: "text", 
            },
            { 
                id: "product", 
                label: "Produto:", 
                type: "text", 
            },
            { 
                id: "quantity", 
                label: "Quantidade:", 
                type: "number", 
            },
            { 
                id: "address", 
                label: "Endereço:", 
                type: "text",
            },
            { 
                id: "location", 
                label: "Localização:", 
                type: "text",
            },
            { 
                id: "details", 
                label: "Detalhes:", 
                type: "textarea", 
                fullWidth: true
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
                label: "Identificador:", 
                type: "text", 
                placeholder:'Digite o identificador'
            },
            { 
                id: "service_order_item_type_id", 
                label: "Tipo de Item de OS:", 
                type: "multi-select", 
                placeholder:'Selecione o tipo'
            },
            { 
                id: "product_id", 
                label: "Produto:", 
                type: "multi-select", 
                placeholder:'Selecione o produto'
            },
            { 
                id: "quantity", 
                label: "Quantidade:", 
                type: "number", 
                placeholder:'Digita a quantidade'
            },
            { 
                id: "address_id", 
                label: "Endereço:", 
                type: "multi-select",
                placeholder:'Selecione o endereço'
            },
            { 
                id: "location_id", 
                label: "Localização:", 
                type: "multi-select",
                placeholder:'Selecione a localização'
            },
            { 
                id: "details", 
                label: "Detalhes:", 
                type: "textarea", 
                fullWidth: true,
                placeholder:'Digite os detalhes'

            },
        ],
    }
];