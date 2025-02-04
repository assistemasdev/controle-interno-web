import { faUsers, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

export const associeteGroupFields =  [
    {
        section: 'Grupos',
        fields: [
            {
                id: 'groups',
                isMulti: true,
                label: 'Grupos',
                type: 'multi-select',
                placeholder: 'Selecione os grupos',
                handleChange: 'handleGroupsChange',
                fullWidth: true,
                icon: faUsers
            },
        ],
    },
];

export const groupFields = [
    {
        section: 'Informações do Grupo',
        fields: [
            {
                id: 'name',
                label: 'Nome do Grupo',
                type: 'text',
                placeholder: 'Digite o nome do grupo',
                fullWidth: true,
                icon: faLayerGroup
            },
        ],
    },
];
