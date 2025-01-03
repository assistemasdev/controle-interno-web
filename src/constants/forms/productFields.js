export const productFields = [
    {
        section: "Dados do Produto",
        fields: [
            { 
                id: "product.name", 
                label: "Nome:", 
                type: "text", 
                placeholder: "Digite o nome do produto", 
                handleChange: "handleChange" 
            },
            { 
                id: "product.number", 
                label: "Número:", 
                type: "number", 
                placeholder: "Digite o número do produto", 
                handleChange: "handleChange" 
            },
            { 
                id: "product.serial_number", 
                label: "Número de Série:", 
                type: "text", 
                placeholder: "Digite o número de série", 
                handleChange: "handleChange" 
            },
            { 
                id: "product.purchase_date", 
                label: "Data de Compra:", 
                type: "date", 
                placeholder: "Adicione data de compra", 
                handleChange: "handleChange" 
            },
            { 
                id: "product.warranty_date", 
                label: "Data de Garantia:", 
                type: "date", 
                placeholder: "Adicione data de garantia", 
                handleChange: "handleChange" 
            },
        ],
    },
    {
        section: "Organização e Fornecedor",
        fields: [
            { 
                id: "product.current_organization_id", 
                label: "Organização Atual:", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione a organização", 
                handleChange: "handleOrganizationChange" 
            },
            { 
                id: "product.owner_organization_id", 
                label: "Empresa de Aquisição:", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione a organização", 
                handleChange: "handleChange" 
            },
            { 
                id: "product.supplier_id", 
                label: "Fornecedor:",
                isMulti: false, 
                type: "select", 
                placeholder: "Selecione o fornecedor", 
                handleChange: "handleChange" 
            },
        ],
    },
    {
        section: "Localização",
        fields: [
            { 
                id: "product.address_id", 
                label: "Endereço:", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione um endereço", 
                handleChange: "handleAddressChange" 
            },
            { 
                id: "product.location_id", 
                label: "Localização:", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione uma localização", 
                handleChange: "handleChange" 
            },
        ],
    },
    {
        section: "Classificação do Produto",
        fields: [
            { 
                id: "product.condition_id", 
                label: "Condição:", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione a condição", 
                handleChange: "handleChange" 
            },
            { 
                id: "product.type_id", 
                label: "Tipo:", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione o tipo", 
                handleChange: "handleTypeChange" 
            },
            { 
                id: "product.category_id", 
                label: "Categoria:", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione a categoria", 
                handleChange: "handleChange" 
            },
        ],
    },
    {
        section: "Grupos",
        fields: [
            { 
                id: "groups", 
                isMulti: true,
                label: "Grupos:", 
                type: "multi-select", 
                placeholder: "Selecione os grupos", 
                handleChange: "handleGroupChange" 
            },
        ],
    },
];
