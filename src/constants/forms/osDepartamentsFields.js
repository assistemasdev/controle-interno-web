import { icon } from '@fortawesome/fontawesome-svg-core';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

export const osDepartamentsFields = [
    {
        section: 'Dados do Departamento',
        fields: [
            {
                id: 'name',
                label: 'Nome: ',
                type: 'text',
                placeholder: "Digite o nome do departamento", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faBuilding
            }
        ]
    }
]
