import { useState, useCallback } from "react";
import { buildFilteredArray } from "../../utils/arrayUtils";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";

export const useConditionFilters = (fetchData, filters, setFilters) => {
    const [selectedConditions, setSelectedConditions] = useState([]);

    const handleChangeConditions = (newSelected, column) => {
        setSelectedConditions((prev) => {
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

            const filledInputs = new Set(selectedConditions.map((option) => option.column)).size;

            const selectedConditionIds = buildFilteredArray(selectedConditions, 'id', 'textFilter', false);
            const selectedConditionNames = buildFilteredArray(selectedConditions, 'name', 'textFilter', true);
            const selectedConditionIdLikes = buildFilteredArray(selectedConditions, 'id', 'numberFilter', true);
            const previousFilters = filters || {}; 

            setFilters(prev => ({
                ...prev,
                id: selectedConditionIds,
                name: selectedConditionNames,
                idLike: selectedConditionIdLikes,
                filledInputs,
                page: 1
            }));

            fetchData({
                id: selectedConditionIds,
                name: selectedConditionNames,
                idLike: selectedConditionIdLikes,
                filledInputs,
                page: 1,
                deleted_at: previousFilters.deleted_at
            });
        },
        [selectedConditions, fetchData, filters, setFilters]
    );

    const handleClearFilters = () => {
        window.location.reload();
    };

    const inputsFilters = [
        {
            label: "Número:",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="id"
                    model="condition"
                    value={selectedConditions.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeConditions(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre as condições pelo número"
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
                    model="condition"
                    value={selectedConditions.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeConditions(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre as condições pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return {
        selectedConditions,
        handleChangeConditions,
        handleFilterSubmit,
        handleClearFilters,
        inputsFilters,
    };
};
