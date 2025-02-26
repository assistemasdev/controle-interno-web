import createField from '../../utils/factory/createField';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export const statusContractFields = [
    {
        section: 'Dados do Status',
        fields: [
            createField({
                id: 'name',
                label: 'Status: ',
                type: 'text',
                placeholder: "Digite o nome do status", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faCircleInfo
            })
        ]
    }
];
