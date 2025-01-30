export const orderServiceFields = [
    {
        section: "Order de Serviço",
        fields: [
            { 
                id: "order.status_id", 
                label: "Status de OS:", 
                type: "multi-select", 
                placeholder: "Selecione o status", 
            },
            { 
                id: "order.departament_id", 
                label: "Departamento de OS:", 
                type: "multi-select", 
                placeholder: "Selecione o departamento", 
            },
            { 
                id: "order.destination_id", 
                label: "Destino de OS:", 
                type: "multi-select", 
                placeholder: "Selecione o destino", 
            },
            { 
                id: "order.deadline", 
                label: "Prazo Final:", 
                type: "date", 
                placeholder: "Selecione a data do prazo final", 
            },
            { 
                id: "order.details", 
                label: "Detalhes:", 
                type: "textarea", 
                placeholder: "Digite o detalhes", 
                fullWidth: true
            },
        ],
    },
    {
        section: "Produtos",
        array: true,
        fields: [
            { 
                id: "items.service_order_item_type_id", 
                label: "Tipo de Item de OS:", 
                type: "multi-select", 
                placeholder:"Digite a Descrição",
            },
            { 
                id: "items.item_id", 
                label: "ID:", 
                type: "text", 
                placeholder:"Digite o Identificador"
            },
            { 
                id: "items.product_id", 
                label: "Produto:", 
                type: "multi-select", 
                placeholder:"Digite a Descrição",
            },
            { 
                id: "items.quantity", 
                label: "Quantidade:", 
                type: "number", 
                placeholder:"Digite a Quantidade",
            },
            {
                id: "items.address_id",
                label: "Endereço:", 
                type: "multi-select", 
                placeholder:"Selecione o endereço",
            },
            {
                id: "items.location_id",
                label: "Localização:", 
                type: "multi-select", 
                placeholder:"Selecione a localização",
            },
            { 
                id: "items.details", 
                label: "Detalhes:", 
                type: "textarea", 
                placeholder:"Digite os detalhes",
                fullWidth: true
            },
        ]
    },

];


// export const editEventFields = [
//     {
//         section: "Dados do Evento",
//         fields: [
//             { 
//                 id: "contract_event_type_id", 
//                 label: "Tipo de Evento:", 
//                 type: "multi-select", 
//                 placeholder: "Selecione o tipo", 
//             },
//             { 
//                 id: "contract_id", 
//                 label: "Contrato:", 
//                 type: "multi-select", 
//                 placeholder: "Selecione o contrato", 
//             },
//         ],
//     },
// ];
