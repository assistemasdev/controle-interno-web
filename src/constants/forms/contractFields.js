export const contractFields = [
    {
        section: "Dados do Contrato",
        fields: [
            { 
                id: "contract.number", 
                label: "Número:", 
                type: "number", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
            },
            { 
                id: "contract.contract_type_id", 
                label: "Tipo:", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
            },
            { 
                id: "contract.contract_status_id", 
                label: "Status:", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
            },
            { 
                id: "contract.organization_id", 
                label: "Organização:", 
                type: "multi-select", 
                placeholder: "Selecione a organização", 
            },
            { 
                id: "contract.customer_id", 
                label: "Cliente:", 
                type: "multi-select", 
                placeholder: "Selecione o cliente", 
            },
            { 
                id: "contract.object", 
                label: "Cláusa:", 
                type: "textarea", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
            },
            { 
                id: "info.duration", 
                label: "Duração:", 
                type: "number", 
                placeholder: "Digite a duração"
            },
            { 
                id: "info.max_duration", 
                label: "Duração Máxima:", 
                type: "number", 
                placeholder: "Digite a duração máxima"
            },
            { 
                id: "info.start_date", 
                label: "Data de Início:", 
                type: "date", 
            },
            { 
                id: "info.total_amount", 
                label: "Valor Total:", 
                type: "number", 
                placeholder: "Digite o valor total"
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
        ],
    },
];


export const contractEditFields = [
    {
        section: "Dados do Contrato",
        fields: [
            { 
                id: "number", 
                label: "Número:", 
                type: "number", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
            },
            { 
                id: "contract_type_id", 
                label: "Tipo:", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
            },
            { 
                id: "contract_status_id", 
                label: "Status:", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
            },
            { 
                id: "organization_id", 
                label: "Organização:", 
                type: "multi-select", 
                placeholder: "Selecione a organização", 
            },
            { 
                id: "customer_id", 
                label: "Cliente:", 
                type: "multi-select", 
                placeholder: "Selecione o cliente", 
            },
            { 
                id: "object", 
                label: "Cláusa:", 
                type: "textarea", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
            }
        ],
    },
];