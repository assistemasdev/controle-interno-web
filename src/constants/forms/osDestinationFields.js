import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export const osDestinationFields = [
    {
        section: 'Dados do Destino',
        fields: [
            {
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: "Digite o nome do destino", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faMapMarkerAlt 
            }
        ]
    }
];
