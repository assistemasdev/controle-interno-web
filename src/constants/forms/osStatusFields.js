import createField from '../../utils/factory/createField';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export const osStatusFields = [
    {
        section: 'Dados do Status',
        fields: [
            createField({
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: "Digite o nome do status", 
                fullWidth: true,
                icon: faCircleInfo 
            })
        ]
    }
];
