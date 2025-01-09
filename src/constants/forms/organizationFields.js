export const organizationFields = [
    {
        section: 'Dados da Organização',
        fields: [
            { 
                id: 'organization.name', 
                label: 'Nome:', 
                type: 'text', 
                placeholder: 'Digite o nome', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
            { 
                id: 'organization.color', 
                label: 'Cor:', 
                type: 'color', 
                placeholder: '', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
        ],
    },
    {
        section: 'Endereço',
        fields: [
            { 
                id: 'address.alias', 
                label: 'Apelido:', 
                type: 'text', 
                placeholder: 'Digite o apelido', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
            { 
                id: 'address.zip', 
                label: 'CEP:', 
                type: 'text', 
                placeholder: 'Digite o CEP', 
                fullWidth: false, 
                handleChange: 'handleCepChange' 
            },
            { 
                id: 'address.street', 
                label: 'Rua:', 
                type: 'text', 
                placeholder: 'Digite a rua', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
            { 
                id: 'address.number', 
                label: 'Número:', 
                type: 'text', 
                placeholder: 'Digite o número', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
            { 
                id: 'address.city', 
                label: 'Cidade:', 
                type: 'text', 
                placeholder: 'Digite a cidade', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
            { 
                id: 'address.state', 
                label: 'Estado:', 
                type: 'text', 
                placeholder: 'Digite o estado', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
            { 
                id: 'address.country', 
                label: 'País:', 
                type: 'text', 
                placeholder: 'Digite o país', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
        ],
    },
];

export const editOrganizationFields = [
    {
        section: 'Dados da Organização',
        fields: [
            { 
                id: 'name', 
                label: 'Nome:', 
                type: 'text', 
                placeholder: 'Digite o nome da organização', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
            { 
                id: 'color', 
                label: 'Cor:', 
                type: 'color', 
                placeholder: '', 
                fullWidth: false, 
                handleChange: 'handleChange' 
            },
        ],
    },
    {
        section: 'Status',
        fields: [
            { 
                id: 'active', 
                label: 'Status:', 
                type: 'multi-select', 
                isMulti: false,
                placeholder: 'Selecione o status da organização', 
                fullWidth: true, 
                handleChange: 'handleChange' 
            },
        ],
    },
];
