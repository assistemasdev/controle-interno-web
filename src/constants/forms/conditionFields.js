import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const conditionFields = [
    {
        section: 'Dados da Condição',
        fields: [
            {
                id: 'name',
                label: 'Condições',
                type: 'text',
                placeholder: "Digite o nome da condição", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faCheckCircle  
            }
        ]
    }
]
