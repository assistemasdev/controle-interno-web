import { faMapMarkerAlt, faCogs, faTag, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField'; 

export const locationFields = [
    {
        section: 'Dados da Localização',
        fields: [
            createField({ 
                id: 'area', 
                label: 'Área', 
                type: 'text', 
                placeholder: 'Digite a área', 
                fullWidth: false, 
                icon: faMapMarkerAlt
            }),
            createField({ 
                id: 'section', 
                label: 'Seção', 
                type: 'text', 
                placeholder: 'Digite a seção', 
                fullWidth: false, 
                icon: faCogs
            }),
            createField({ 
                id: 'spot', 
                label: 'Ponto', 
                type: 'text', 
                placeholder: 'Digite o ponto', 
                fullWidth: false, 
                icon: faTag
            }),
            createField({ 
                id: 'details', 
                label: 'Detalhes', 
                type: 'text', 
                placeholder: 'Digite os detalhes', 
                fullWidth: false, 
                icon: faInfoCircle
            }),
        ],
    },
];
