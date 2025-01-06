export const applicationFields = [
    {
        section: 'Dados da Aplicação',
        fields: [
            {
                id: 'name',
                label: 'Nome:',
                type: 'text',
                placeholder: 'Digite o nome da aplicação',
                fullWidth: false,
            },
            {
                id: 'session_code',
                label: 'Código de Sessão:',
                type: 'text',
                placeholder: 'Digite o código de sessão',
                fullWidth: false,
            },
            {
                id: 'active',
                label: 'Ativo:',
                type: 'select',
                placeholder: 'Selecione o status',
                options: [
                    { label: 'Ativo', value: 1 },
                    { label: 'Inativo', value: 0 },
                ],
                fullWidth: true,
            },
        ],
    },
];
