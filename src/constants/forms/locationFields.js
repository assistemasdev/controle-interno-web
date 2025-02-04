import { faMapMarkerAlt, faCogs, faTag, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export const locationFields = [
    {
        section: 'Dados da Localização',
        fields: [
            { 
                id: 'area', 
                label: 'Área', 
                type: 'text', 
                placeholder: 'Digite a área', 
                fullWidth: false, 
                icon: faMapMarkerAlt
            },
            { 
                id: 'section', 
                label: 'Seção', 
                type: 'text', 
                placeholder: 'Digite a seção', 
                fullWidth: false, 
                icon: faCogs
            },
            { 
                id: 'spot', 
                label: 'Ponto', 
                type: 'text', 
                placeholder: 'Digite o ponto', 
                fullWidth: false, 
                icon: faTag
            },
            { 
                id: 'details', 
                label: 'Detalhes', 
                type: 'text', 
                placeholder: 'Digite os detalhes', 
                fullWidth: false, 
                icon: faInfoCircle
            },
        ],
    },
];
