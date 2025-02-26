import { faUserTag } from '@fortawesome/free-solid-svg-icons'; 
import createField from '../../utils/factory/createField';

export const roleFields = [
    {
        section: "Dados do Cargo",
        fields: [
            createField({
                id: "name",
                label: "Nome",
                type: "text",
                placeholder: "Digite o nome do cargo",
                fullWidth: true,
                icon: faUserTag
            }),
            createField({
                id: "permissions",
                isMulti: true,
                label: "Permissões",
                type: "multi-select",
                placeholder: "Selecione as permissões",
                fullWidth: true,
                icon: faUserTag
            }),
        ],
    },
];
