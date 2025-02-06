import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useSupplierFilters = (fetchSuppliers, filters, setFilters) => {
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);

    const handleChangeSuppliers = useCallback((newSelected, column) => {
        setSelectedSuppliers((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];
            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        
        const selectedIds = buildFilteredArray(selectedSuppliers, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedSuppliers, 'name', 'textFilter', true);
        const selectedICpfCnpjs = buildFilteredArray(selectedSuppliers, 'cpf_cnpj', 'textFilter', true);
        const filledInputs = new Set(selectedSuppliers.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            cpf_cnpj: selectedICpfCnpjs,
            filledInputs,
            page: 1, 
        }));
    
        fetchSuppliers({
            id: selectedIds,
            name: selectedNames,
            cpf_cnpj: selectedICpfCnpjs,
            filledInputs,
            page: 1,
            perPage: previousFilters.perPage, 
            deleted_at: previousFilters.deleted_at, 
        });
    };

    const handleClearFilters = () => {
        window.location.reload();
    };

    const inputsfilters = [
        {
            label: "Nome",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="name"
                    model='supplier'
                    value={selectedSuppliers.filter((option) => option.column === 'name')}
                    onChange={(selected) => handleChangeSuppliers(selected, 'name')}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os fornecedores pelo nome"
                    isMulti
                />
            ),
        },
        {
            label: "CPF/CNPJ",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="cpf_cnpj"
                    model='supplier'
                    value={selectedSuppliers.filter((option) => option.column === 'cpf_cnpj')}
                    onChange={(selected) => handleChangeSuppliers(selected, 'cpf_cnpj')}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os fornecedores pelo cpf/cnpj"
                    isMulti
                />
            ),
        },
    ];

    return { selectedSuppliers, handleChangeSuppliers, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useSupplierFilters;
