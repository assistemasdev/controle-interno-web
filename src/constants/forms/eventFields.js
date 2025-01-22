export const eventFields = [
    {
        section: "Tipo de Evento",
        fields: [
            { 
                id: "event.event_type_id", 
                label: "Tipo de Evento:", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                fullWidth: true,
            },
        ],
    },
    {
        section: "Informações do Contrato",
        fields: [
            { 
                id: "info.start_date", 
                label: "Data de Início:", 
                type: "date", 
            },
            { 
                id: "info.total_amount", 
                label: "Valor Total:", 
                type: "number", 
                placeholder:"Digite o Valor Total"
            },
            { 
                id: "info.end_date", 
                label: "Data de Término:", 
                type: "date", 
            },
            { 
                id: "info.max_end_date", 
                label: "Data de Término Máxima:", 
                type: "date", 
            },
            { 
                id: "info.duration", 
                label: "Duração:", 
                type: "number", 
                placeholder:"Digite a Duração"
            },
            { 
                id: "info.max_duration", 
                label: "Duração Máxima:", 
                type: "number", 
                placeholder:"Digite a Duração Máxima"
            },
        ],
    },
    {
        section: "Produtos",
        array: true,
        count: 0,
        fields: [
            { 
                id: "products.item_id", 
                label: "ID:", 
                type: "text", 
                placeholder:"Digite o Identificador",
                fullWidth:true,
            },
            { 
                id: "products.description", 
                label: "Descrição:", 
                type: "textarea", 
                placeholder:"Digite a Descrição",
                fullWidth:true,
            },
            { 
                id: "products.quantity", 
                label: "Quantidade:", 
                type: "number", 
                placeholder:"Digite a Quantidade",
            },
            { 
                id: "products.price", 
                label: "Preço:", 
                type: "number", 
                placeholder:"Digite o Preço",
            },
        ]
    },
    {
        section: "Serviços",
        array: true,
        count: 0,
        fields: [
            { 
                id: "jobs.item_id", 
                label: "ID:", 
                type: "text", 
                placeholder:"Digite o Identificador",
                fullWidth:true,
            },
            { 
                id: "jobs.description", 
                label: "Descrição:", 
                type: "textarea", 
                placeholder:"Digite a Descrição",
                fullWidth:true,
            },
        ]
    }

];
