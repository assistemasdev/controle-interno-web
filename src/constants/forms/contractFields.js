import createField from '../../utils/factory/createField';
import { 
    faFileAlt, faClipboardCheck, faBuilding, faUser, faCalendarAlt, 
    faMoneyBillWave, faTools, faBoxOpen 
} from '@fortawesome/free-solid-svg-icons';

export const contractFields = [
    {
        section: "Dados do Contrato",
        fields: [
            createField({
                id: "contract.number", 
                label: "Número", 
                type: "number", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt
            }),
            createField({
                id: "contract.contract_type_id", 
                label: "Tipo", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                entity: 'contractType',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck
            }),
            createField({
                id: "contract.contract_status_id", 
                label: "Status", 
                type: "multi-select", 
                entity: 'contractStatus',
                column: 'id',
                columnLabel: 'name',
                placeholder: "Selecione o status", 
                icon: faClipboardCheck
            }),
            createField({
                id: "contract.organization_id", 
                label: "Organização", 
                type: "multi-select", 
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                placeholder: "Selecione a organização", 
                icon: faBuilding
            }),
            createField({
                id: "contract.customer_id", 
                label: "Cliente", 
                type: "multi-select", 
                placeholder: "Selecione o cliente", 
                entity: 'customer',
                column: 'id',
                columnLabel: 'name',
                icon: faUser
            }),
            createField({
                id: "contract.object", 
                label: "Cláusula", 
                type: "textarea", 
                fullWidth: true,
                placeholder: "Digite a cláusula", 
                icon: faFileAlt
            }),
            createField({
                id: "info.duration", 
                label: "Duração", 
                type: "number", 
                placeholder: "Digite a duração",
                icon: faCalendarAlt
            }),
            createField({
                id: "info.max_duration", 
                label: "Duração Máxima", 
                type: "number", 
                placeholder: "Digite a duração máxima",
                icon: faCalendarAlt
            }),
            createField({
                id: "info.start_date", 
                label: "Data de Início", 
                type: "date", 
                icon: faCalendarAlt
            }),
            createField({
                id: "info.total_amount", 
                label: "Valor Total", 
                type: "number", 
                placeholder: "Digite o valor total",
                icon: faMoneyBillWave
            }),
            createField({
                id: "info.end_date", 
                label: "Data de Término", 
                type: "date", 
                icon: faCalendarAlt
            }),
            createField({
                id: "info.max_end_date", 
                label: "Data de Término Máxima", 
                type: "date", 
                icon: faCalendarAlt
            }),
        ],
    },
    {
        section: "Produtos",
        array: true,
        count: 0,
        fields: [
            createField({ 
                id: "items.item_id", 
                label: "ID", 
                type: "text", 
                placeholder:"Digite o Identificador",
                fullWidth:true,
                icon: faBoxOpen
            }),
            createField({ 
                id: "items.description", 
                label: "Descrição", 
                type: "textarea", 
                placeholder:"Digite a Descrição",
                fullWidth:true,
                icon: faBoxOpen
            }),
            createField({ 
                id: "items.quantity", 
                label: "Quantidade", 
                type: "number", 
                placeholder:"Digite a Quantidade",
                icon: faBoxOpen
            }),
            createField({ 
                id: "items.price", 
                label: "Preço", 
                type: "number", 
                placeholder:"Digite o Preço",
                icon: faMoneyBillWave
            }),
        ]
    },
    {
        section: "Serviços",
        array: true,
        count: 0,
        fields: [
            createField({ 
                id: "jobs.item_id", 
                label: "ID", 
                type: "text", 
                placeholder:"Digite o Identificador",
                fullWidth:true,
                icon: faTools
            }),
            createField({ 
                id: "jobs.description", 
                label: "Descrição", 
                type: "textarea", 
                placeholder:"Digite a Descrição",
                fullWidth:true,
                icon: faTools
            }),
        ]
    }
];

export const contractEditFields = [
    {
        section: "Dados do Contrato",
        fields: [
            createField({
                id: "number", 
                label: "Número", 
                type: "number", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt
            }),
            createField({
                id: "contract_type_id", 
                label: "Tipo", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                entity: 'contractType',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck
            }),
            createField({
                id: "contract_status_id", 
                label: "Status", 
                type: "multi-select", 
                entity: 'contractStatus',
                column: 'id',
                columnLabel: 'name',
                placeholder: "Selecione o tipo", 
                icon: faClipboardCheck
            }),
            createField({
                id: "organization_id", 
                label: "Organização", 
                type: "multi-select", 
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                placeholder: "Selecione a organização", 
                icon: faBuilding
            }),
            createField({
                id: "customer_id", 
                label: "Cliente", 
                type: "multi-select", 
                entity: 'customer',
                column: 'id',
                columnLabel: 'name',
                placeholder: "Selecione o cliente", 
                icon: faUser
            }),
            createField({
                id: "object", 
                label: "Cláusa", 
                type: "textarea", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt
            })
        ],
    },
];

export const contractDetailsFields = [
    {
        section: "Dados do Contrato",
        fields: [
            createField({
                id: "contract.number", 
                label: "Número", 
                type: "number", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt,
                disabled: true
            }),
            createField({
                id: "contract.contract_type_id", 
                label: "Tipo", 
                type: "multi-select", 
                placeholder: "Selecione o tipo", 
                entity: 'contractType',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck,
                disabled: true
            }),
            createField({
                id: "contract.contract_status_id", 
                label: "Status", 
                type: "multi-select", 
                entity: 'contractStatus',
                column: 'id',
                columnLabel: 'name',
                placeholder: "Selecione o tipo", 
                icon: faClipboardCheck,
                disabled: true
            }),
            createField({
                id: "contract.organization_id", 
                label: "Organização", 
                type: "multi-select", 
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                placeholder: "Selecione a organização", 
                icon: faBuilding,
                disabled: true
            }),
            createField({
                id: "contract.customer_id", 
                label: "Cliente", 
                type: "multi-select", 
                placeholder: "Selecione o cliente", 
                entity: 'customer',
                column: 'id',
                columnLabel: 'name',
                icon: faUser,
                disabled: true
            }),
            createField({
                id: "contract.object", 
                label: "Cláusa", 
                type: "textarea", 
                fullWidth: true,
                placeholder: "Digite o número do contrato", 
                icon: faFileAlt,
                disabled: true
            }),
            createField({
                id: "info.duration", 
                label: "Duração", 
                type: "number", 
                placeholder: "Digite a duração",
                icon: faCalendarAlt,
                disabled: true
            }),
            createField({
                id: "info.max_duration", 
                label: "Duração Máxima", 
                type: "number", 
                placeholder: "Digite a duração máxima",
                icon: faCalendarAlt,
                disabled: true
            }),
            createField({
                id: "info.start_date", 
                label: "Data de Início", 
                type: "date", 
                icon: faCalendarAlt,
                disabled: true
            }),
            createField({
                id: "info.total_amount", 
                label: "Valor Total", 
                type: "number", 
                placeholder: "Digite o valor total",
                icon: faMoneyBillWave,
                disabled: true
            }),
            createField({
                id: "info.end_date", 
                label: "Data de Término", 
                type: "date", 
                icon: faCalendarAlt,
                disabled: true
            }),
            createField({
                id: "info.max_end_date", 
                label: "Data de Término Máxima", 
                type: "date", 
                icon: faCalendarAlt,
                disabled: true
            }),
        ],
    },
]