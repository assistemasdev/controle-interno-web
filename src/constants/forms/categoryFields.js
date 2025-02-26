import { faTag } from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField'; 

export const categoryFields = [
    {
        section: 'Dados da Categoria',
        fields: [
            createField({
                id: 'name',
                label: 'Categoria',
                type: 'text',
                placeholder: "Digite o nome da categoria", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faTag  
            })
        ]
    }
]
