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
    filters = {},
    exclude_ids,
    disabled = false
}) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedValues, setSelectedValues] = useState(isMulti ? [] : {label: "", value: ""});
    const { debouncedFn } = useDebounce(fetchOptions, 500);
    const [fetchedLabels, setFetchedLabels] = useState({});
    const { showLoader, hideLoader } = useLoader();

    async function fetchOptions(inputValue) {
        if (!inputValue) {
            setOptions([]);
            return;
        }

        try {
            const response = await baseService.autocomplete(entity, { [column]: inputValue, exclude_ids, ...filters });
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
        const idsOnlyValue = idsToFetch
        .map(obj => {
            if (!obj?.value) return null; 
            return obj.value;
        })
        .filter(value => value !== null); 
        
        if (idsToFetch.length === 0 || idsOnlyValue.length === 0) return; 

        try {
            showLoader();
            const response = await baseService.autocomplete(entity, { id: idsOnlyValue, exclude_ids });
            const newLabels = {};
    
            response.result.forEach(item => {
                newLabels[item.id] = item[columnLabel] + (item[columnDetails] ? ' - ' + item[columnDetails] : '');
            });
    
            setFetchedLabels(prev => ({ ...prev, ...newLabels }));
    
            let updatedSelectedValues = [];
    
            if (isMulti) {
                updatedSelectedValues = [
                    ...ids
                        .map(id => {
                            const label = newLabels[id.value] || fetchedLabels[id.value] || null;
                            if (!label) return null;  

                            return {
                                value: id.value,
                                label: label || 'Carregando...'
                            };
                        })
                        .filter(item => item !== null),  
            
                    ...Object.keys(fetchedLabels)
                        .map(id => {
                            const label = fetchedLabels[id] || null;
                            if (!label) return null; 
            
                            const existingValue = selectedValues.find(item => item.value === id);
            
                            if (existingValue) {
                                return
                            }
            
                            return {
                                value: id,
                                label: label || 'Carregando...'
                            };
                        })
                        .filter(item => item !== null), 
                ];
                console.log(updatedSelectedValues)
            } else {
                const idToUse = ids[0]?.value || ids[0];    
                const label = newLabels[idToUse] || fetchedLabels[idToUse] || null;
            
                if (!label) {
                    updatedSelectedValues = null;  
                } else {
                    updatedSelectedValues = {
                        value: idToUse,
                        label: label || 'Carregando...'
                    };
                }
            }
    
            setSelectedValues(updatedSelectedValues);
    
        } catch (error) {
            console.error("Erro ao buscar labels:", error);
        } finally {
            hideLoader();
        }
    };
    
    useEffect(() => {
        if (Array.isArray(value) ? value.length > 0 : value) {
            const ids = Array.isArray(value) ? value : [value];
            const idsToFetch = ids.filter(id => !fetchedLabels[id]); 
            if (idsToFetch.length > 0) {
                fetchLabelsByIds(idsToFetch);
            } else {
                setSelectedValues(
                    ids.map(id => ({
                        value: id,
                        label: fetchedLabels[id] || 'Carregando...'
                    }))
                );
            }
        }
    }, [value]);

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
            placeholder={placeholder || 'Digite o que está procurando'}
            noOptionsMessage={() => "Nenhuma opção encontrada"}
            isDisabled={disabled}
        />
    );
};

export default AutoCompleteInput;
