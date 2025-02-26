import { faBox, faHashtag, faDollarSign, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import createField from '../../utils/factory/createField'; 

export const eventItemFields = [
    {
        section: 'Dados do Item do Evento',
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
                id: 'quantity', 
                label: 'Quantidade', 
                type: 'number', 
                placeholder: 'Digite a quantidade', 
                fullWidth: false, 
                icon: faHashtag 
            }),
            createField({ 
                id: 'price', 
                label: 'Preço', 
                type: 'number', 
                placeholder: 'Digite o preço', 
                fullWidth: false, 
                icon: faDollarSign 
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
