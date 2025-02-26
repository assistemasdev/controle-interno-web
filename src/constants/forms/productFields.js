import { 
    faBox, faHashtag, faBarcode, faCalendarDay, faBuilding, faIndustry, faMapMarkerAlt, 
    faMapPin, faLayerGroup, faClipboardCheck, faList, faClipboardList, faTag, faUsers
} from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField';
export const productFields = [
    {
        section: "Dados do Produto",
        fields: [
            createField({ 
                id: "product.name", 
                label: "Nome", 
                type: "text", 
                placeholder: "Digite o nome do produto", 
                icon: faBox
            }),
            createField({ 
                id: "product.number", 
                label: "Número", 
                type: "number", 
                placeholder: "Digite o número do produto", 
                icon: faHashtag
            }),
            createField({ 
                id: "product.serial_number", 
                label: "Número de Série", 
                type: "text", 
                placeholder: "Digite o número de série", 
                icon: faBarcode
            }),
            createField({ 
                id: "product.purchase_date", 
                label: "Data de Compra", 
                type: "date", 
                placeholder: "Adicione data de compra", 
                icon: faCalendarDay
            }),
            createField({ 
                id: "product.warranty_date", 
                label: "Data de Garantia", 
                type: "date", 
                placeholder: "Adicione data de garantia", 
                fullWidth: true,
                icon: faCalendarDay
            }),
        ],
    },
    {
        section: "Organização e Fornecedor",
        fields: [
            createField({ 
                id: "product.current_organization_id", 
                label: "Organização Atual", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione a organização", 
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                icon: faBuilding
            }),
            createField({ 
                id: "product.owner_organization_id", 
                label: "Empresa de Aquisição", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione a organização", 
                entity: 'organization',
                column: 'id',
                columnLabel: 'name',
                icon: faIndustry
            }),
            createField({ 
                id: "product.supplier_id", 
                label: "Fornecedor",
                isMulti: false, 
                type: "select", 
                placeholder: "Selecione o fornecedor", 
                entity: 'supplier',
                column: 'id',
                columnLabel: 'name',
                fullWidth: true,
                icon: faIndustry
            }),
        ],
    },
    {
        section: "Localização",
        fields: [
            createField({ 
                id: "product.address_id", 
                label: "Endereço", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione um endereço", 
                icon: faMapMarkerAlt
            }),
            createField({ 
                id: "product.location_id", 
                label: "Localização", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione uma localização", 
                icon: faMapPin
            }),
        ],
    },
    {
        section: "Classificação do Produto",
        fields: [
            createField({ 
                id: "product.condition_id", 
                label: "Condição", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione a condição", 
                entity: 'condition',
                column: 'id',
                columnLabel: 'name',
                icon: faClipboardCheck
            }),
            createField({ 
                id: "product.type_id", 
                label: "Tipo", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione o tipo",
                entity: 'type',
                column: 'id',
                columnLabel: 'name', 
                icon: faList
            }),
            createField({ 
                id: "product.category_id", 
                label: "Categoria", 
                isMulti: false,
                type: "select", 
                placeholder: "Selecione a categoria", 
                entity: 'category',
                column: 'id',
                columnLabel: 'name',
                fullWidth: true,
                icon: faClipboardList
            }),
        ],
    },
    {
        section: "Grupos",
        fields: [
            createField({ 
                id: "groups", 
                isMulti: true,
                label: "Grupos", 
                type: "multi-select", 
                placeholder: "Selecione os grupos", 
                fullWidth: true,
                icon: faUsers
            }),
        ],
    },
];

export const detailsProductFields = [
    {
        section: "Dados do Produto",
        fields: [
            createField({ 
                id: "product.name", 
                label: "Nome", 
                type: "text", 
                placeholder: "Digite o nome do produto",
                fullWidth: true,
                icon: faBox,
                disabled: true
            }),
            createField({ 
                id: "product.number", 
                label: "Número", 
                type: "text", 
                placeholder: "Digite o número do produto",
                icon: faHashtag,
                disabled: true
            }),
            createField({ 
                id: "product.serial_number", 
                label: "Número de Série", 
                type: "text", 
                placeholder: "Digite o número de série",
                icon: faBarcode,
                disabled: true
            }),
            createField({ 
                id: "product.purchase_date", 
                label: "Data de Compra", 
                type: "text", 
                placeholder: "Adicione data de compra",
                icon: faCalendarDay,
                disabled: true
            }),
            createField({ 
                id: "product.warranty_date", 
                label: "Data de Garantia", 
                type: "text", 
                placeholder: "Adicione data de garantia",
                icon: faCalendarDay,
                disabled: true
            }),
        ],
    },
    {
        section: "Organização e Fornecedor",
        fields: [
            createField({ 
                id: "product.current_organization", 
                label: "Organização Atual", 
                type: "text", 
                placeholder: "Digite a organização atual",
                icon: faBuilding,
                disabled: true
            }),
            createField({ 
                id: "product.owner_organization", 
                label: "Empresa de Aquisição", 
                type: "text", 
                placeholder: "Digite a empresa de aquisição",
                icon: faIndustry,
                disabled: true
            }),
            createField({ 
                id: "product.supplier", 
                label: "Fornecedor",
                type: "text", 
                placeholder: "Digite o fornecedor",
                fullWidth: true,
                icon: faIndustry,
                disabled: true
            }),
        ],
    },
    {
        section: "Localização",
        fields: [
            createField({ 
                id: "product.address_id", 
                label: "Endereço", 
                isMulti: false,
                type: "text", 
                placeholder: "Selecione um endereço", 
                icon: faMapMarkerAlt,
                disabled: true
            }),
            createField({ 
                id: "product.location_id", 
                label: "Localização", 
                isMulti: false,
                type: "text", 
                placeholder: "Selecione uma localização", 
                icon: faMapPin,
                disabled: true
            }),
        ],
    },
    {
        section: "Classificação do Produto",
        fields: [
            createField({ 
                id: "product.condition", 
                label: "Condição", 
                type: "text", 
                placeholder: "Digite a condição",
                icon: faClipboardCheck,
                disabled: true
            }),
            createField({ 
                id: "product.type", 
                label: "Tipo", 
                type: "text", 
                placeholder: "Digite o tipo",
                icon: faList,
                disabled: true
            }),
            createField({ 
                id: "product.category", 
                label: "Categoria", 
                type: "text", 
                placeholder: "Digite a categoria",
                fullWidth: true,
                icon: faClipboardList,
                disabled: true
            }),
        ],
    },
    {
        section: "Status e Grupos",
        fields: [
            createField({ 
                id: "product.status", 
                label: "Status", 
                type: "text", 
                placeholder: "Digite o status",
                icon: faTag,
                disabled: true
            }),
            createField({ 
                id: "product.groups", 
                label: "Grupos", 
                type: "text", 
                placeholder: "Digite os grupos",
                icon: faUsers,
                disabled: true
            }),
        ],
    },
];