import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useOrganizationFilters = (fetchOrganizations, filters, setFilters) => {
    const [selectedOrganizations, setSelectedOrganizations] = useState([]);

    const handleChangeOrganizations = useCallback((newSelected, column) => {
        setSelectedOrganizations((prev) => {
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
        
        const selectedOrgIds = buildFilteredArray(selectedOrganizations, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedOrganizations, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedOrganizations, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedOrganizations.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedOrgIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchOrganizations({
            id: selectedOrgIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at
        });
    };

    const handleClearFilters = () => {
        window.location.reload();
    };

    const inputsfilters = [
        {
            label: "Número",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="id"
                    model="organization"
                    value={selectedOrganizations.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeOrganizations(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre as organizações pelo número"
                    isMulti
                />
            ),
        },
        {
            label: "Nome",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="name"
                    model="organization"
                    value={selectedOrganizations.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeOrganizations(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre as organizações pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedOrganizations, handleChangeOrganizations, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useOrganizationFilters;
