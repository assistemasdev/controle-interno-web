import createField from '../../utils/factory/createField';
import { faUsers, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

export const associeteGroupFields =  [
    {
        section: 'Grupos',
        fields: [
            createField({
                id: 'groups',
                isMulti: true,
                label: 'Grupos',
                type: 'multi-select',
                placeholder: 'Selecione os grupos',
                fullWidth: true,
                icon: faUsers
            }),
        ],
    },
];

export const groupFields = [
    {
        section: 'Informações do Grupo',
        fields: [
            createField({
                id: 'name',
                label: 'Nome do Grupo',
                type: 'text',
                placeholder: 'Digite o nome do grupo',
                fullWidth: true,
                icon: faLayerGroup
            }),
        ],
    },
];
