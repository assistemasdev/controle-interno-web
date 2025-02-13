import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useOrderServiceGlobalFilters = (fetchProducts, filters, setFilters) => {
    const [selectedOs, setSelectedOs] = useState([]);

    const handleChangeOs = useCallback((newSelected, column) => {
        setSelectedOs((prev) => {
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
        
        const selectedIds = buildFilteredArray(selectedOs, 'id', 'identifyFilter', false);
        const selectedIdLikes = buildFilteredArray(selectedOs, 'id', 'identifyFilter', true);
        const selectedContracts = buildFilteredArray(selectedOs, 'contract_id', 'contractFilter', true);
        const filledInputs = new Set(selectedOs.map((option) => option.column)).size;
        const previousFilters = filters || {}; 

        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            idLike: selectedIdLikes,
            contract_id: selectedContracts,
            filledInputs,
            page: 1,
        }));
    
        fetchProducts({
            id: selectedIds,
            idLike: selectedIdLikes,
            contract_id: selectedContracts,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at, 
        });
    };

    const handleClearFilters = () => {
        window.location.reload();
    };

    const inputsfilters = [
        {
            label: "Identificador",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="id"
                    model="serviceOrder"
                    value={selectedOs.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeOs(selected, "id")}
                    onBlurColumn="identifyFilter"
                    placeholder="Filtre as ordens de serviços pelo identificador"
                    isMulti
                />
            ),
        },
        {
            label: "Contrato",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="contract_id"
                    model="serviceOrder"
                    value={selectedOs.filter((option) => option.column === "contract_id")}
                    onChange={(selected) => handleChangeOs(selected, "contract_id")}
                    onBlurColumn="contractFilter"
                    placeholder="Filtre as ordens de serviços pelo contrato"
                    isMulti
                />
            ),
        },
    ];

    return { selectedOs, handleChangeOs, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useOrderServiceGlobalFilters;
