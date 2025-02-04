import { faTag, faMapMarkerAlt, faRoad, faHashtag, faInfoCircle, faBuilding, faCity, faGlobe, faFlag } from '@fortawesome/free-solid-svg-icons';

export const addressFields = [
    {
        section: 'Dados do Endereço',
        fields: [
            { id: 'alias', label: 'Apelido', type: 'text', placeholder: 'Digite o apelido', fullWidth: false, icon: faTag },
            { id: 'zip', label: 'CEP', type: 'text', placeholder: 'Digite o CEP', fullWidth: false, icon: faMapMarkerAlt },
            { id: 'street', label: 'Rua', type: 'text', placeholder: 'Digite a rua', fullWidth: false, icon: faRoad },
            { id: 'number', label: 'Número', type: 'text', placeholder: 'Digite o número', fullWidth: false, icon: faHashtag },
            { id: 'details', label: 'Detalhes', type: 'text', placeholder: 'Digite os detalhes', fullWidth: false, icon: faInfoCircle },
            { id: 'district', label: 'Bairro', type: 'text', placeholder: 'Digite o bairro', fullWidth: false, icon: faBuilding },
            { id: 'city', label: 'Cidade', type: 'text', placeholder: 'Digite a cidade', fullWidth: false, icon: faCity },
            { id: 'state', label: 'Estado', type: 'text', placeholder: 'Digite o estado', fullWidth: false, icon: faFlag },
            { id: 'country', label: 'País', type: 'text', placeholder: 'Digite o país', fullWidth: true, icon: faGlobe },
        ],
    },
];
