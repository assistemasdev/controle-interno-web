import createField from '../../utils/factory/createField';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

export const kitFields = [
    {
        section: 'Informações do Kit',
        fields: [
            createField({
                id: 'name',
                label: 'Nome do Kit',
                type: 'text',
                placeholder: 'Digite o nome do kit',
                fullWidth: true,
                icon: faLayerGroup
            }),
        ],
    },
];
