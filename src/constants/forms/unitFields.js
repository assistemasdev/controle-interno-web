import createField from '../../utils/factory/createField';
import { faWeightHanging, faRuler } from '@fortawesome/free-solid-svg-icons';

export const unitFields = [
    {
        section: 'Informações da Unidade',
        fields: [
            createField({
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Digite o nome da unidade',
                isMulti: false,
                icon: faRuler
            }),
            createField({
                id: 'abbreviation',
                label: 'Abreviação',
                type: 'text',
                placeholder: 'Digite a abreviação da unidade',
                isMulti: false,
                icon: faRuler
            }),
        ],
    },
];

export const unitAssociationFields = [
    {
        section: "Unidades Relacionadas",
        fields: [
            createField({
                id: "units",
                label: "Unidades",
                type: "multi-select",
                isMulti: true,
                placeholder: "Selecione as unidades relacionadas",
                handleChange: "handleUnitsChange",
                fullWidth: true,
                icon: faWeightHanging
            }),
        ],
    },
];
