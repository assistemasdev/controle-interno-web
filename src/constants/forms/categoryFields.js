import { faTag } from '@fortawesome/free-solid-svg-icons';

export const categoryFields = [
    {
        section: 'Dados da Categoria',
        fields: [
            {
                id: 'name',
                label: 'Categoria',
                type: 'text',
                placeholder: "Digite o nome da categoria", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faTag  
            }
        ]
    }
]
