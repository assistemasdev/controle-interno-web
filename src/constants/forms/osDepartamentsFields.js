import createField from '../../utils/factory/createField';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

export const osDepartamentsFields = [
    {
        section: 'Dados do Departamento',
        fields: [
            createField({
                id: 'name',
                label: 'Nome: ',
                type: 'text',
                placeholder: "Digite o nome do departamento", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faBuilding
            })
        ]
    }
];
