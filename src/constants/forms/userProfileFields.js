import { faUser, faUserCircle, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

export const userProfileFields = [
    {
        section: 'Dados do Usuário',
        fields: [
            {
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Digite o nome do usuário',
                handleChange: 'handleDefaultChange',
                icon: faUser,
            },
            {
                id: 'username',
                label: 'Usuário',
                type: 'text',
                placeholder: 'Digite o nome de usuário',
                handleChange: 'handleDefaultChange',
                icon: faUserCircle,
            },
            {
                id: 'email',
                label: 'E-mail',
                type: 'email',
                placeholder: 'Digite o e-mail',
                handleChange: 'handleDefaultChange',
                icon: faEnvelope,
                fullWidth: true,
            },
            {
                id: 'password',
                label: 'Senha',
                type: 'password',
                placeholder: 'Digite uma nova senha',
                handleChange: 'handleDefaultChange',
                icon: faLock,
            },
            {
                id: 'password_confirmation',
                label: 'Confirmar Senha',
                type: 'password',
                placeholder: 'Confirme a nova senha',
                handleChange: 'handleDefaultChange',
                icon: faLock,
            },
        ],
    },
];
