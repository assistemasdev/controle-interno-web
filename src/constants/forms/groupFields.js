export const groupFields =  [
    {
        section: 'Grupos',
        fields: [
            {
                id: 'groups',
                isMulti: true,
                label: 'Grupos:',
                type: 'multi-select',
                placeholder: 'Selecione os grupos',
                handleChange: 'handleGroupsChange',
                fullWidth: true
            },
        ],
    },
];
