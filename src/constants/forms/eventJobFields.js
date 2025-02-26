import { faBox,  faFileAlt } from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField'; 

export const eventJobFields = [
    {
        section: 'Dados do Serviço do Evento',
        fields: [
            createField({ 
                id: 'item_id', 
                label: 'Item Id', 
                type: 'text', 
                placeholder: 'Digite o identificador', 
                fullWidth: true, 
                icon: faBox 
            }),
            createField({ 
                id: 'description', 
                label: 'Descrição', 
                type: 'textarea', 
                placeholder: 'Digite a descrição', 
                fullWidth: true, 
                icon: faFileAlt 
            }),
        ],
    },
];
