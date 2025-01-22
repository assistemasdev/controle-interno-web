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
                handleChange: "handleGroupChange" ,
                fullWidth: true
            },
        ],
    },
];


export const detailsProductFields = [
    {
        section: "Dados do Produto",
        fields: [
            { 
                id: "product.name", 
                label: "Nome:", 
                type: "text", 
                placeholder: "Digite o nome do produto",
                handleChange: "handleChange",
                fullWidth: true
            },
            { 
                id: "product.number", 
                label: "Número:", 
                type: "text", 
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
                type: "text", 
                placeholder: "Adicione data de compra",
                handleChange: "handleChange" 
            },
            { 
                id: "product.warranty_date", 
                label: "Data de Garantia:", 
                type: "text", 
                placeholder: "Adicione data de garantia",
                handleChange: "handleChange" 
            },
        ],
    },
    {
        section: "Organização e Fornecedor",
        fields: [
            { 
                id: "product.current_organization", 
                label: "Organização Atual:", 
                type: "text", 
                placeholder: "Digite a organização atual",
                handleChange: "handleOrganizationChange" 
            },
            { 
                id: "product.owner_organization", 
                label: "Empresa de Aquisição:", 
                type: "text", 
                placeholder: "Digite a empresa de aquisição",
                handleChange: "handleChange" 
            },
            { 
                id: "product.supplier", 
                label: "Fornecedor:",
                type: "text", 
                placeholder: "Digite o fornecedor",
                handleChange: "handleChange" ,
                fullWidth: true
            },
        ],
    },
    {
        section: "Classificação do Produto",
        fields: [
            { 
                id: "product.condition", 
                label: "Condição:", 
                type: "text", 
                placeholder: "Digite a condição",
                handleChange: "handleChange" 
            },
            { 
                id: "product.type", 
                label: "Tipo:", 
                type: "text", 
                placeholder: "Digite o tipo",
                handleChange: "handleTypeChange" 
            },
            { 
                id: "product.category", 
                label: "Categoria:", 
                type: "text", 
                placeholder: "Digite a categoria",
                handleChange: "handleChange",
                fullWidth: true
            },
        ],
    },
    {
        section: "Status e Grupos",
        fields: [
            { 
                id: "product.status", 
                label: "Status:", 
                type: "text", 
                placeholder: "Digite o status",
                handleChange: "handleChange" 
            },
            { 
                id: "product.groups", 
                label: "Grupos:", 
                type: "text", 
                placeholder: "Digite os grupos",
                handleChange: "handleGroupChange" 
            },
        ],
    },
];
