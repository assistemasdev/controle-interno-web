export const userProfileFields = [
    {
        section: 'Dados do Usuário',
        fields: [
            {
                id: 'name',
                label: 'Nome:',
                type: 'text',
                placeholder: 'Digite o nome do usuário',
                handleChange: 'handleDefaultChange',
            },
            {
                id: 'username',
                label: 'Usuário:',
                type: 'text',
                placeholder: 'Digite o nome de usuário',
                handleChange: 'handleDefaultChange',
            },
            {
                id: 'email',
                label: 'E-mail:',
                type: 'email',
                placeholder: 'Digite o e-mail',
                handleChange: 'handleDefaultChange',
            },
            {
                id: 'password',
                label: 'Senha:',
                type: 'password',
                placeholder: 'Digite uma nova senha',
                handleChange: 'handleDefaultChange',
            },
            {
                id: 'password_confirmation',
                label: 'Confirmar Senha:',
                type: 'password',
                placeholder: 'Confirme a nova senha',
                handleChange: 'handleDefaultChange',
            },
        ],
    },
];
