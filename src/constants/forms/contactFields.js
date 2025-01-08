// src/constants/forms/contactFields.js
export const contactFields = [
    {
        section: 'Dados do Contato',
        fields: [
            { id: 'name', label: 'Nome:', type: 'text', placeholder: 'Digite o nome', required: true },
            { id: 'surname', label: 'Sobrenome:', type: 'text', placeholder: 'Digite o sobrenome', required: true },
            { id: 'role', label: 'Cargo:', type: 'text', placeholder: 'Digite o cargo', required: false },
            { id: 'ddd', label: 'DDD Telefone Fixo:', type: 'text', placeholder: 'Digite o DDD', required: false },
            { id: 'phone', label: 'Telefone Fixo:', type: 'text', placeholder: 'Digite o telefone', required: false },
            { id: 'cell_ddd', label: 'DDD Celular:', type: 'text', placeholder: 'Digite o DDD do celular', required: false },
            { id: 'cell', label: 'Celular:', type: 'text', placeholder: 'Digite o celular', required: false },
            { id: 'email', label: 'E-mail:', type: 'email', placeholder: 'Digite o e-mail', required: true },
        ],
    },
];
