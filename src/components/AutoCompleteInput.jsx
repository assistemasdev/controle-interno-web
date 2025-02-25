import { useEffect, useState } from "react";
import Select from "react-select";
import baseService from "../services/baseService";
import useLoader from "../hooks/useLoader";
import useDebounce from "../hooks/useDebounce";

const AutoCompleteInput = ({ 
    entity, 
    column, 
    columnLabel, 
    columnDetails,
    onChange = {}, 
    placeholder = "Digite algo...", 
    isMulti = false, 
    value,
    exclude_ids
}) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedValues, setSelectedValues] = useState(isMulti ? [] : null);  
    const { debouncedFn } = useDebounce(fetchOptions, 500);
    const [fetchedLabels, setFetchedLabels] = useState({});
    const { showLoader, hideLoader } = useLoader();

    async function fetchOptions(inputValue) {
        if (!inputValue) {
            setOptions([]);
            return;
        }

        try {
            const response = await baseService.autocomplete(entity, { [column]: inputValue, exclude_ids });
            setOptions(response.result.map((item) => ({
                value: item.id,
                label: item[columnLabel] + (item[columnDetails] ? ' - ' + item[columnDetails] : '')
            })));
        } catch (error) {
            console.error("Erro ao buscar opções:", error);
            setOptions([]);
        }
    }

    const handleInputChange = (value) => {
        setInputValue(value);
        debouncedFn(value); 
    };

    const handleChange = (selectedOption) => {
        setSelectedValues(selectedOption);
        setInputValue(selectedOption ? selectedOption.label : "");

        if (onChange) {
            onChange(selectedOption);
        }
    };

    const getLabelByValue = (value) => {
        if (Array.isArray(selectedValues)) {
            const selected = selectedValues.find(opt => opt.value === value);
            return selected ? selected.label : '';
        }

        if (selectedValues && selectedValues.value === value) {
            return selectedValues.label;
        }

        return '';
    };

    const fetchLabelsByIds = async (ids) => {
        const idsToFetch = ids.filter(id => !fetchedLabels[id]); 
    
        if (idsToFetch.length === 0) return; 
    
        try {
            showLoader();
            const response = await baseService.autocomplete(entity, { id: idsToFetch, exclude_ids });
            const newLabels = {};
    
            response.result.forEach(item => {
                newLabels[item.id] = item[columnLabel] + (item[columnDetails] ? ' - ' + item[columnDetails] : '');
            });
    
            setFetchedLabels(prev => ({ ...prev, ...newLabels }));
    
            if (isMulti) {
                setSelectedValues(ids.map(id => ({
                    value: id,
                    label: newLabels[id] || fetchedLabels[id] || 'Carregando...'
                })));
            } else {
                setSelectedValues({
                    value: ids[0],
                    label: newLabels[ids[0]] || fetchedLabels[ids[0]] || 'Carregando...'
                });
            }
        } catch (error) {
            console.error("Erro ao buscar labels:", error);
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        if (value) {
            const ids = Array.isArray(value) ? value : [value];
            const idsToFetch = ids.filter(id => !fetchedLabels[id]); 
            
            if (idsToFetch.length > 0) {
                fetchLabelsByIds(idsToFetch);
            }
        }
    }, [value, fetchedLabels]);

    useEffect(() => {
        if (value && selectedValues) {
            if (Array.isArray(selectedValues)) {
                setSelectedValues(selectedValues.map((selected) => ({
                    ...selected,
                    label: getLabelByValue(selected.value)
                })));
            } else {
                setSelectedValues({
                    value: selectedValues.value,
                    label: getLabelByValue(selectedValues.value)
                });
            }
        } else {
            setSelectedValues(null);
        }
    }, [value]);

    

    return (
        <Select
            options={options}
            value={selectedValues}
            onInputChange={handleInputChange}
            onChange={handleChange}
            isMulti={isMulti}
            placeholder={placeholder}
            noOptionsMessage={() => "Nenhuma opção encontrada"}
        />
    );
};

export default AutoCompleteInput;
