import { faTag, faMapMarkerAlt, faRoad, faHashtag, faInfoCircle, faBuilding, faCity, faGlobe, faFlag } from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField'; 

export const addressFields = [
    {
        section: 'Dados do Endereço',
        fields: [
            createField({ 
                id: 'alias', 
                label: 'Apelido', 
                type: 'text', 
                placeholder: 'Digite o apelido', 
                fullWidth: false, 
                icon: faTag 
            }),
            createField({ 
                id: 'zip', 
                label: 'CEP', 
                type: 'text', 
                placeholder: 'Digite o CEP', 
                fullWidth: false, 
                icon: faMapMarkerAlt 
            }),
            createField({ 
                id: 'street', 
                label: 'Rua', 
                type: 'text', 
                placeholder: 'Digite a rua', 
                fullWidth: false, 
                icon: faRoad 
            }),
            createField({ 
                id: 'number', 
                label: 'Número', 
                type: 'text', 
                placeholder: 'Digite o número', 
                fullWidth: false, 
                icon: faHashtag 
            }),
            createField({ 
                id: 'details', 
                label: 'Detalhes', 
                type: 'text', 
                placeholder: 'Digite os detalhes', 
                fullWidth: false, 
                icon: faInfoCircle 
            }),
            createField({ 
                id: 'district', 
                label: 'Bairro', 
                type: 'text', 
                placeholder: 'Digite o bairro', 
                fullWidth: false, 
                icon: faBuilding 
            }),
            createField({ 
                id: 'city', 
                label: 'Cidade', 
                type: 'text', 
                placeholder: 'Digite a cidade', 
                fullWidth: false, 
                icon: faCity 
            }),
            createField({ 
                id: 'state', 
                label: 'Estado', 
                type: 'text', 
                placeholder: 'Digite o estado', 
                fullWidth: false, 
                icon: faFlag 
            }),
            createField({ 
                id: 'country', 
                label: 'País', 
                type: 'text', 
                placeholder: 'Digite o país', 
                fullWidth: true, 
                icon: faGlobe 
            }),
        ],
    },
];
