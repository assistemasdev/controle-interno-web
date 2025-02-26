import { faBuilding, faMapMarkerAlt, faPalette, faCity, faFlag, faGlobe, faHashtag } from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField'; 

export const organizationFields = [
    {
        section: 'Dados da Organização',
        fields: [
            createField({ 
                id: 'organization.name', 
                label: 'Nome', 
                type: 'text', 
                placeholder: 'Digite o nome', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faBuilding 
            }),
            createField({ 
                id: 'organization.color', 
                label: 'Cor', 
                type: 'color', 
                placeholder: '', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faPalette 
            }),
        ],
    },
    {
        section: 'Endereço',
        fields: [
            createField({ 
                id: 'address.alias', 
                label: 'Apelido', 
                type: 'text', 
                placeholder: 'Digite o apelido', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faHashtag 
            }),
            createField({ 
                id: 'address.zip', 
                label: 'CEP', 
                type: 'text', 
                placeholder: 'Digite o CEP', 
                fullWidth: false, 
                handleChange: 'handleCepChange', 
                icon: faMapMarkerAlt 
            }),
            createField({ 
                id: 'address.street', 
                label: 'Rua', 
                type: 'text', 
                placeholder: 'Digite a rua', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faMapMarkerAlt 
            }),
            createField({ 
                id: 'address.number', 
                label: 'Número', 
                type: 'text', 
                placeholder: 'Digite o número', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faHashtag 
            }),
            createField({ 
                id: 'address.city', 
                label: 'Cidade', 
                type: 'text', 
                placeholder: 'Digite a cidade', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faCity 
            }),
            createField({ 
                id: 'address.state', 
                label: 'Estado', 
                type: 'text', 
                placeholder: 'Digite o estado', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faFlag 
            }),
            createField({ 
                id: 'address.country', 
                label: 'País', 
                type: 'text', 
                placeholder: 'Digite o país', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faGlobe 
            }),
        ],
    },
];

export const editOrganizationFields = [
    {
        section: 'Dados da Organização',
        fields: [
            createField({ 
                id: 'name', 
                label: 'Nome', 
                type: 'text', 
                placeholder: 'Digite o nome da organização', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faBuilding 
            }),
            createField({ 
                id: 'color', 
                label: 'Cor', 
                type: 'color', 
                placeholder: '', 
                fullWidth: false, 
                handleChange: 'handleChange', 
                icon: faPalette 
            }),
        ],
    },
    {
        section: 'Status',
        fields: [
            createField({ 
                id: 'active', 
                label: 'Status', 
                type: 'multi-select', 
                isMulti: false,
                placeholder: 'Selecione o status da organização', 
                fullWidth: true, 
                handleChange: 'handleChange', 
                icon: faBuilding 
            }),
        ],
    },
];
