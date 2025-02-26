import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField'; 

export const conditionFields = [
    {
        section: 'Dados da Condição',
        fields: [
            createField({
                id: 'name',
                label: 'Condições',
                type: 'text',
                placeholder: "Digite o nome da condição", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faCheckCircle  
            })
        ]
    }
]
