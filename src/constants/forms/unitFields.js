import { faWeightHanging, faRuler } from '@fortawesome/free-solid-svg-icons';

export const unitFields = [
    {
        section: 'Informações da Unidade',
        fields: [
            {
                id: 'name',
                label: 'Nome',
                type: 'text',
                placeholder: 'Digite o nome da unidade',
                isMulti: false,
                icon: faRuler
            },
            {
                id: 'abbreviation',
                label: 'Abreviação',
                type: 'text',
                placeholder: 'Digite a abreviação da unidade',
                isMulti: false,
                icon: faRuler
            },
        ],
    },
];

export const unitAssociationFields = [
    {
        section: "Unidades Relacionadas",
        fields: [
            {
                id: "units",
                label: "Unidades",
                type: "multi-select",
                isMulti: true,
                placeholder: "Selecione as unidades relacionadas",
                handleChange: "handleUnitsChange",
                fullWidth: true,
                icon: faWeightHanging
            },
        ],
    },
];
