export const roleFields = [
    {
        section: "Dados do Cargo",
        fields: [
            { 
                id: "name", 
                label: "Nome:", 
                type: "text", 
                placeholder: "Digite o nome do cargo", 
                handleChange: "handleChange",
                fullWidth: true
            },
            { 
                id: "permissions", 
                isMulti: true,
                label: "Permissões:", 
                type: "multi-select", 
                placeholder: "Selecione as permissões", 
                handleChange: "handleGroupChange",
                fullWidth: true
            },
        ],
    },
];


