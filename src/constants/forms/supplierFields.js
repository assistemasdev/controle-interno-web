export const supplierFields = [
    {
        section: 'Informações Gerais',
        fields: [
            {
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Nome completo do fornecedor',
                fullWidth: true,
            },
            {
                id: 'alias',
                label: 'Apelido',
                type: 'text',
                placeholder: 'Apelido do fornecedor',
                fullWidth: false,
            },

            {
                id: 'cpf_cnpj',
                label: 'CPF/CNPJ',
                type: 'text',
                placeholder: 'Documento do fornecedor',
                fullWidth: false,
            },
        ],
    }
];

export const createSupplierFields = [
    {
        section: 'Informações do Fornecedor',
        fields: [
            {
                id: 'supplier.alias',
                label: 'Apelido',
                type: 'text',
                placeholder: 'Digite o apelido do fornecedor',
                required: true,
            },
            {
                id: 'supplier.name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Digite o nome do fornecedor',
                required: true,
            },
            {
                id: 'supplier.cpf_cnpj',
                label: 'CPF/CNPJ',
                type: 'text',
                placeholder: 'Digite o CPF ou CNPJ',
                required: true,
            },
        ],
    },
    {
        section: 'Endereço',
        fields: [
            {
                id: 'address.alias',
                label: 'Apelido do Endereço',
                type: 'text',
                placeholder: 'Digite o apelido do endereço',
                required: true,
            },
            {
                id: 'address.zip',
                label: 'CEP',
                type: 'text',
                placeholder: 'Digite o CEP',
                required: true,
            },
            {
                id: 'address.street',
                label: 'Rua',
                type: 'text',
                placeholder: 'Digite a rua',
                required: true,
            },
            {
                id: 'address.number',
                label: 'Número',
                type: 'text',
                placeholder: 'Digite o número',
                required: true,
            },
            {
                id: 'address.details',
                label: 'Complemento',
                type: 'text',
                placeholder: 'Digite detalhes adicionais',
                required: false,
            },
            {
                id: 'address.district',
                label: 'Bairro',
                type: 'text',
                placeholder: 'Digite o bairro',
                required: true,
            },
            {
                id: 'address.city',
                label: 'Cidade',
                type: 'text',
                placeholder: 'Digite a cidade',
                required: true,
            },
            {
                id: 'address.state',
                label: 'Estado',
                type: 'text',
                placeholder: 'Digite o estado',
                required: true,
            },
            {
                id: 'address.country',
                label: 'País',
                type: 'text',
                placeholder: 'Digite o país',
                required: true,
            },
            {
                id: 'address.ddd',
                label: 'DDD (Telefone)',
                type: 'text',
                placeholder: 'Digite o DDD',
                required: false,
            },
            {
                id: 'address.phone',
                label: 'Telefone',
                type: 'text',
                placeholder: 'Digite o telefone',
                required: false,
            },
            {
                id: 'address.email',
                label: 'E-mail',
                type: 'email',
                placeholder: 'Digite o e-mail',
                required: false,
            },
        ],
    },
    {
        section: 'Contato',
        fields: [
            {
                id: 'contact.name',
                label: 'Nome do Contato',
                type: 'text',
                placeholder: 'Digite o nome do contato',
                required: true,
            },
            {
                id: 'contact.surname',
                label: 'Sobrenome',
                type: 'text',
                placeholder: 'Digite o sobrenome do contato',
                required: false,
            },
            {
                id: 'contact.role',
                label: 'Cargo',
                type: 'text',
                placeholder: 'Digite o cargo',
                required: false,
            },
            {
                id: 'contact.ddd',
                label: 'DDD (Telefone)',
                type: 'text',
                placeholder: 'Digite o DDD',
                required: true,
            },
            {
                id: 'contact.phone',
                label: 'Telefone',
                type: 'text',
                placeholder: 'Digite o telefone',
                required: true,
            },
            {
                id: 'contact.cell_ddd',
                label: 'DDD (Celular)',
                type: 'text',
                placeholder: 'Digite o DDD do celular',
                required: false,
            },
            {
                id: 'contact.cell',
                label: 'Celular',
                type: 'text',
                placeholder: 'Digite o número do celular',
                required: false,
            },
            {
                id: 'contact.email',
                label: 'E-mail',
                type: 'email',
                placeholder: 'Digite o e-mail do contato',
                required: true,
            },
        ],
    },
];

