import createField from '../../utils/factory/createField';
import { faTag } from '@fortawesome/free-solid-svg-icons';

export const typeContractsFields = [
    {
        section: 'Dados do Tipo',
        fields: [
            createField({
                id: 'name',
                label: 'Tipo',
                type: 'text',
                placeholder: "Digite o nome do tipo", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faTag
            })
        ]
    }
];
