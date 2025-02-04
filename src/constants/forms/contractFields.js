import { faFileAlt, faClipboardCheck, faBuilding, faUser, faCalendarAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

export const contractFields = [
    {
        section: "Dados do Contrato",
        fields: [
            { 
                id: "contract.number", 
                label: "Número", 
                type: "number", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt
            },
            { 
                id: "contract.contract_type_id", 
                label: "Tipo", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                icon: faClipboardCheck
            },
            { 
                id: "contract.contract_status_id", 
                label: "Status", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                icon: faClipboardCheck
            },
            { 
                id: "contract.organization_id", 
                label: "Organização", 
                type: "multi-select", 
                placeholder: "Selecione a organização", 
                icon: faBuilding
            },
            { 
                id: "contract.customer_id", 
                label: "Cliente", 
                type: "multi-select", 
                placeholder: "Selecione o cliente", 
                icon: faUser
            },
            { 
                id: "contract.object", 
                label: "Cláusa", 
                type: "textarea", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt
            },
            { 
                id: "info.duration", 
                label: "Duração", 
                type: "number", 
                placeholder: "Digite a duração",
                icon: faCalendarAlt
            },
            { 
                id: "info.max_duration", 
                label: "Duração Máxima", 
                type: "number", 
                placeholder: "Digite a duração máxima",
                icon: faCalendarAlt
            },
            { 
                id: "info.start_date", 
                label: "Data de Início", 
                type: "date", 
                icon: faCalendarAlt
            },
            { 
                id: "info.total_amount", 
                label: "Valor Total", 
                type: "number", 
                placeholder: "Digite o valor total",
                icon: faMoneyBillWave
            },
            { 
                id: "info.end_date", 
                label: "Data de Término", 
                type: "date", 
                icon: faCalendarAlt
            },
            { 
                id: "info.max_end_date", 
                label: "Data de Término Máxima", 
                type: "date", 
                icon: faCalendarAlt
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
                label: "Número", 
                type: "number", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt
            },
            { 
                id: "contract_type_id", 
                label: "Tipo", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                icon: faClipboardCheck
            },
            { 
                id: "contract_status_id", 
                label: "Status", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                icon: faClipboardCheck
            },
            { 
                id: "organization_id", 
                label: "Organização", 
                type: "multi-select", 
                placeholder: "Selecione a organização", 
                icon: faBuilding
            },
            { 
                id: "customer_id", 
                label: "Cliente", 
                type: "multi-select", 
                placeholder: "Selecione o cliente", 
                icon: faUser
            },
            { 
                id: "object", 
                label: "Cláusa", 
                type: "textarea", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt
            }
        ],
    },
];
