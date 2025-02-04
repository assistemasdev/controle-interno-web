import { faTag } from '@fortawesome/free-solid-svg-icons';

export const typeFields = [
    {
        section: 'Dados do Tipo',
        fields: [
            {
                id: 'name',
                label: 'Tipo', 
                type: 'text',
                placeholder: "Digite o nome do tipo", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faTag
            }
        ]
    }
];
