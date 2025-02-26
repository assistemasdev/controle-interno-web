import createField from '../../utils/factory/createField';
import { faTag, faFileAlt } from '@fortawesome/free-solid-svg-icons';

export const typeEventsFields = [
    {
        section: 'Dados do Tipo',
        fields: [
            createField({
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: "Digite o nome do tipo", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faTag,
            }),
            createField({
                id: 'description',
                label: 'Descrição',
                type: 'textarea',
                placeholder: "Digite a descrição", 
                handleChange: 'handleChange',
                fullWidth: true,
                icon: faFileAlt
            })
        ]
    }
];
