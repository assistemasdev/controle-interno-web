import { faUser, faUserCircle, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField';

export const userProfileFields = [
    {
        section: 'Dados do Usuário',
        fields: [
            createField({
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Digite o nome do usuário',
                icon: faUser,
            }),
            createField({
                id: 'username',
                label: 'Usuário',
                type: 'text',
                placeholder: 'Digite o nome de usuário',
                icon: faUserCircle,
            }),
            createField({
                id: 'email',
                label: 'E-mail',
                type: 'email',
                placeholder: 'Digite o e-mail',
                icon: faEnvelope,
                fullWidth: true,
            }),
            createField({
                id: 'password',
                label: 'Senha',
                type: 'password',
                placeholder: 'Digite uma nova senha',
                icon: faLock,
            }),
            createField({
                id: 'password_confirmation',
                label: 'Confirmar Senha',
                type: 'password',
                placeholder: 'Confirme a nova senha',
                icon: faLock,
            }),
        ],
    },
];
