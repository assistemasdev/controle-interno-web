export const typeEventsFields = [
    {
        section: 'Dados do Tipo',
        fields: [
            {
                id: 'name',
                label: 'Nome: ',
                type: 'text',
                placeholder: "Digite o nome do tipo", 
                handleChange: 'handleChange',
                fullWidth: true
            },
            {
                id: 'description',
                label: 'Descrição: ',
                type: 'textarea',
                placeholder: "Digite a descrição", 
                handleChange: 'handleChange',
                fullWidth: true
            }
        ]
    }
]
