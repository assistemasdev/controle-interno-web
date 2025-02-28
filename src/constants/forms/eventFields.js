import { faCalendarAlt, faMoneyBillWave, faBoxOpen, faTools, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

export const dynamicFields = {
    1: [ // Exemplo: Tipo de evento 1 (Manutenção)
        {
            section: "Informações do Contrato",
            fields: [
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
                    placeholder:"Digite o Valor Total",
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
                { 
                    id: "info.duration", 
                    label: "Duração", 
                    type: "number", 
                    placeholder:"Digite a Duração",
                    icon: faCalendarAlt
                },
                { 
                    id: "info.max_duration", 
                    label: "Duração Máxima", 
                    type: "number", 
                    placeholder:"Digite a Duração Máxima",
                    icon: faCalendarAlt
                },
            ],
        },
        {
            section: "Produtos",
            array: true,
            count: 0,
            fields: [
                { 
                    id: "items.item_id", 
                    label: "ID", 
                    type: "text", 
                    placeholder:"Digite o Identificador",
                    fullWidth:true,
                    icon: faBoxOpen
                },
                { 
                    id: "items.description", 
                    label: "Descrição", 
                    type: "textarea", 
                    placeholder:"Digite a Descrição",
                    fullWidth:true,
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
                    id: "items.price", 
                    label: "Preço", 
                    type: "number", 
                    placeholder:"Digite o Preço",
                    icon: faMoneyBillWave
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
                    label: "ID", 
                    type: "text", 
                    placeholder:"Digite o Identificador",
                    fullWidth:true,
                    icon: faTools
                },
                { 
                    id: "jobs.description", 
                    label: "Descrição", 
                    type: "textarea", 
                    placeholder:"Digite a Descrição",
                    fullWidth:true,
                    icon: faTools
                },
            ]
        }
    ],
    2: [
        {
            section: "Informações do Contrato",
            fields: [
                { 
                    id: "info.end_date", 
                    label: "Data de Término", 
                    type: "date", 
                    icon: faCalendarAlt,
                    fullWidth:true
                }
            ],
        },
    ],
    3: [
        {
            section: "Produtos",
            fields: [
                { 
                    id: "items.item_id", 
                    label: "Item Id", 
                    type: "text", 
                    icon:faBoxOpen,
                    placeholder:"Digite o identificador",
                },
                { 
                    id: "items.quantity", 
                    label: "Quantidade", 
                    type: "number", 
                    placeholder:"Digite a Quantidade",
                    icon: faBoxOpen
                },
            ],
        },
    ]
};

export const baseEventFields = [
    {
        section: "Tipo de Evento",
        fields: [
            { 
                id: "event.contract_event_type_id", 
                label: "Tipo de Evento", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                entity: 'contractEventType',
                column: 'id',
                columnLabel: 'name',
                fullWidth: true,
                icon: faClipboardCheck
            }
        ]
    }
];

// export const eventFields = [
//     {
//         section: "Tipo de Evento",
//         fields: [
//             { 
//                 id: "event.contract_event_type_id", 
//                 label: "Tipo de Evento", 
//                 type: "multi-select", 
//                 placeholder: "Selecione o tipo", 
//                 entity: 'contractEventType',
//                 column: 'id',
//                 columnLabel: 'name',
//                 fullWidth: true,
//                 icon: faClipboardCheck
//             },
//         ],
//     },
//     {
//         section: "Informações do Contrato",
//         fields: [
//             { 
//                 id: "info.start_date", 
//                 label: "Data de Início", 
//                 type: "date", 
//                 icon: faCalendarAlt
//             },
//             { 
//                 id: "info.total_amount", 
//                 label: "Valor Total", 
//                 type: "number", 
//                 placeholder:"Digite o Valor Total",
//                 icon: faMoneyBillWave
//             },
//             { 
//                 id: "info.end_date", 
//                 label: "Data de Término", 
//                 type: "date", 
//                 icon: faCalendarAlt
//             },
//             { 
//                 id: "info.max_end_date", 
//                 label: "Data de Término Máxima", 
//                 type: "date", 
//                 icon: faCalendarAlt
//             },
//             { 
//                 id: "info.duration", 
//                 label: "Duração", 
//                 type: "number", 
//                 placeholder:"Digite a Duração",
//                 icon: faCalendarAlt
//             },
//             { 
//                 id: "info.max_duration", 
//                 label: "Duração Máxima", 
//                 type: "number", 
//                 placeholder:"Digite a Duração Máxima",
//                 icon: faCalendarAlt
//             },
//         ],
//     },
//     {
//         section: "Produtos",
//         array: true,
//         count: 0,
//         fields: [
//             { 
//                 id: "items.item_id", 
//                 label: "ID", 
//                 type: "text", 
//                 placeholder:"Digite o Identificador",
//                 fullWidth:true,
//                 icon: faBoxOpen
//             },
//             { 
//                 id: "items.description", 
//                 label: "Descrição", 
//                 type: "textarea", 
//                 placeholder:"Digite a Descrição",
//                 fullWidth:true,
//                 icon: faBoxOpen
//             },
//             { 
//                 id: "items.quantity", 
//                 label: "Quantidade", 
//                 type: "number", 
//                 placeholder:"Digite a Quantidade",
//                 icon: faBoxOpen
//             },
//             { 
//                 id: "items.price", 
//                 label: "Preço", 
//                 type: "number", 
//                 placeholder:"Digite o Preço",
//                 icon: faMoneyBillWave
//             },
//         ]
//     },
//     {
//         section: "Serviços",
//         array: true,
//         count: 0,
//         fields: [
//             { 
//                 id: "jobs.item_id", 
//                 label: "ID", 
//                 type: "text", 
//                 placeholder:"Digite o Identificador",
//                 fullWidth:true,
//                 icon: faTools
//             },
//             { 
//                 id: "jobs.description", 
//                 label: "Descrição", 
//                 type: "textarea", 
//                 placeholder:"Digite a Descrição",
//                 fullWidth:true,
//                 icon: faTools
//             },
//         ]
//     }
// ];

export const editEventFields = [
    {
        section: "Dados do Evento",
        fields: [
            { 
                id: "contract_event_type_id", 
                label: "Tipo de Evento", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                entity: 'contractEventType',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck
            },
            { 
                id: "contract_id", 
                label: "Contrato", 
                type: "multi-select", 
                placeholder: "Selecione o contrato", 
                icon: faClipboardCheck
            },
        ],
    },
];

export const detailsEventFields = [
    {
        section: "Dados do Evento",
        fields: [
            { 
                id: "eventType", 
                label: "Tipo de Evento", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                entity: 'contractEventType',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck
            },
            { 
                id: "contract", 
                label: "Contrato", 
                type: "multi-select", 
                placeholder: "Selecione o contrato", 
                icon: faClipboardCheck
            },
        ],
    },
];
