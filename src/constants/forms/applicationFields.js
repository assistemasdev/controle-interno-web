import { faDesktop, faCode, faToggleOn } from '@fortawesome/free-solid-svg-icons'; 

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
                icon: faDesktop, 
            },
            {
                id: 'session_code',
                label: 'Código de Sessão:',
                type: 'text',
                placeholder: 'Digite o código de sessão',
                fullWidth: false,
                icon: faCode, 
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
                icon: faToggleOn,
            },
        ],
    },
];
