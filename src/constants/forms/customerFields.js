export const customerFields = [
    {
        section: 'Cliente',
        fields: [
            {
                id: 'customer.alias',
                label: 'Nome Fantasia',
                type: 'text',
                placeholder: 'Digite o nome fantasia',
                required: true,
            },
            {
                id: 'customer.name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Digite o nome do cliente',
                required: true,
            },
            {
                id: 'customer.cpf_cnpj',
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
        ],
    },
    {
        section: 'Localização',
        fields: [
            {
                id: 'location.area',
                label: 'Área',
                type: 'text',
                placeholder: 'Digite a área',
            },
            {
                id: 'location.section',
                label: 'Seção',
                type: 'text',
                placeholder: 'Digite a seção',
            },
            {
                id: 'location.spot',
                label: 'Ponto',
                type: 'text',
                placeholder: 'Digite o ponto',
            },
            {
                id: 'location.details',
                label: 'Detalhes',
                type: 'text',
                placeholder: 'Digite os detalhes',
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
                label: 'Sobrenome do Contato',
                type: 'text',
                placeholder: 'Digite o sobrenome do contato',
                required: true,
            },
            {
                id: 'contact.role',
                label: 'Cargo',
                type: 'text',
                placeholder: 'Digite o cargo',
            },
            {
                id: 'contact.ddd',
                label: 'DDD',
                type: 'text',
                placeholder: 'Digite o DDD',
            },
            {
                id: 'contact.phone',
                label: 'Telefone',
                type: 'text',
                placeholder: 'Digite o telefone',
            },
            {
                id: 'contact.cell_ddd',
                label: 'DDD (Celular)',
                type: 'text',
                placeholder: 'Digite o DDD do celular',
            },
            {
                id: 'contact.cell',
                label: 'Celular',
                type: 'text',
                placeholder: 'Digite o celular',
            },
            {
                id: 'contact.email',
                label: 'E-mail',
                type: 'email',
                placeholder: 'Digite o e-mail',
                required: true,
            },
        ],
    },
];

export const editCustomerFields = [
    {
        section: 'Cliente',
        fields: [
            {
                id: 'alias',
                label: 'Nome Fantasia',
                type: 'text',
                placeholder: 'Digite o nome fantasia',
                required: true,
            },
            {
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Digite o nome do cliente',
                required: true,
            },
            {
                id: 'cpf_cnpj',
                label: 'CPF/CNPJ',
                type: 'text',
                placeholder: 'Digite o CPF ou CNPJ',
                required: true,
                fullWidth: true
            },
        ],
    },
];
