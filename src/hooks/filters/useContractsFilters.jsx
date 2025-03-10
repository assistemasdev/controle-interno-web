import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useContractsFilters = (fetchProducts, filters, setFilters) => {
    const [selectedContracts, setSelectedContracts] = useState([]);

    const handleChangeContracts = useCallback((newSelected, column) => {
        setSelectedContracts((prev) => {
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
        
        const selectedNames = buildFilteredArray(selectedContracts, 'name', 'nameFilter', true); // Mudança aqui
        const selectedNumbers = buildFilteredArray(selectedContracts, 'number', 'numberFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedContracts, 'id', 'identifyFilter', true);
        const filledInputs = new Set(selectedContracts.map((option) => option.column)).size;
        const previousFilters = filters || {}; 

        setFilters(prev => ({
            ...prev,
            name: selectedNames,
            number: selectedNumbers,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
        }));
    
        fetchProducts({
            name: selectedNames,
            number: selectedNumbers,
            idLike: selectedIdLikes,
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
            label: "Nome",  
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="name"  
                    model="contract"
                    value={selectedContracts.filter((option) => option.column === "name")}  
                    onChange={(selected) => handleChangeContracts(selected, "name")} 
                    onBlurColumn="nameFilter"  
                    placeholder="Filtre os contratos pelo nome"  
                    isMulti
                />
            ),
        },
        {
            label: "Número",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="number"
                    model="contract"
                    value={selectedContracts.filter((option) => option.column === "number")}
                    onChange={(selected) => handleChangeContracts(selected, "number")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os contratos pelo número"
                    isMulti
                />
            ),
        },
    ];

    return { selectedContracts, handleChangeContracts, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useContractsFilters;
