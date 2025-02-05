import { useState, useCallback } from "react";
import { buildFilteredArray } from "../../utils/arrayUtils";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";

export const useRoleFilters = (fetchData, filters, setFilters) => {
    const [selectedRoles, setSelectedRoles] = useState([]);

    const handleChangeRoles = (newSelected, column) => {
        setSelectedRoles((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];
            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    };

    const handleFilterSubmit = useCallback(
        (e) => {
            e.preventDefault();

            const filledInputs = new Set(selectedRoles.map((option) => option.column)).size;

            const selectedRoleIds = buildFilteredArray(selectedRoles, 'id', 'textFilter', false);
            const selectedRoleNames = buildFilteredArray(selectedRoles, 'name', 'textFilter', true);
            const selectedRoleIdLikes = buildFilteredArray(selectedRoles, 'id', 'numberFilter', true);
            const previousFilters = filters || {}; 

            setFilters(prev => ({
                ...prev,
                id: selectedRoleIds,
                name: selectedRoleNames,
                idLike: selectedRoleIdLikes,
                filledInputs,
                page: 1
            }));

            fetchData({
                id: selectedRoleIds,         
                name: selectedRoleNames,       
                idLike: selectedRoleIdLikes,     
                filledInputs,
                page: 1,         
                deleted_at: previousFilters.deleted_at 
            });
        },
        [selectedRoles, fetchData, filters, setFilters]
    );

    const handleClearFilters = () => {
        window.location.reload();
    };

    const inputsfilters = [
        {
            label: "Número:",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="id"
                    model="role"
                    value={selectedRoles.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeRoles(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os cargos pelo número"
                    isMulti
                />
            ),
        },
        {
            label: "Nome:",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="name"
                    model="role"
                    value={selectedRoles.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeRoles(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os cargos pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return {
        selectedRoles,
        handleChangeRoles,
        handleFilterSubmit,
        handleClearFilters,
        inputsfilters,
    };
};
