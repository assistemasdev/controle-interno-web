import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'; 

export const osStatusFields = [
    {
        section: 'Dados do Status',
        fields: [
            {
                id: 'name',
                label: 'Nome: ',
                type: 'text',
                placeholder: "Digite o nome do status", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faCircleInfo 
            }
        ]
    }
];
