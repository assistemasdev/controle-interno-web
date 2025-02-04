import { faUser, faBriefcase, faPhoneAlt, faMobileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export const contactFields = [
    {
        section: 'Dados do Contato',
        fields: [
            { id: 'name', label: 'Nome', type: 'text', placeholder: 'Digite o nome', required: true, icon: faUser },
            { id: 'surname', label: 'Sobrenome', type: 'text', placeholder: 'Digite o sobrenome', required: true, icon: faUser },
            { id: 'role', label: 'Cargo', type: 'text', placeholder: 'Digite o cargo', required: false, icon: faBriefcase },
            { id: 'ddd', label: 'DDD Telefone Fixo', type: 'text', placeholder: 'Digite o DDD', required: false, icon: faPhoneAlt },
            { id: 'phone', label: 'Telefone Fixo', type: 'text', placeholder: 'Digite o telefone', required: false, icon: faPhoneAlt },
            { id: 'cell_ddd', label: 'DDD Celular', type: 'text', placeholder: 'Digite o DDD do celular', required: false, icon: faMobileAlt },
            { id: 'cell', label: 'Celular', type: 'text', placeholder: 'Digite o celular', required: false, icon: faMobileAlt },
            { id: 'email', label: 'E-mail', type: 'email', placeholder: 'Digite o e-mail', required: true, icon: faEnvelope },
        ],
    },
];
