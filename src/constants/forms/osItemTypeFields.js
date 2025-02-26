import createField from '../../utils/factory/createField';
import { faTags } from '@fortawesome/free-solid-svg-icons';

export const osItemTypeFields = [
    {
        section: 'Dados do Tipo',
        fields: [
            createField({
                id: 'name',
                label: 'Tipo',
                type: 'text',
                placeholder: "Digite o nome do tipo", 
                fullWidth: true,
                icon: faTags 
            })
        ]
    }
];
