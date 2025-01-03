import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import Select from "react-select";
import useAutocomplete from "../hooks/useAutocomplete";

const AutoCompleteFilter = ({
    value,
    service,
    columnDataBase,
    onChange,
    onBlurColumn,
    onFocus,
    placeholder,
    isMulti = false,
    isClearable = true,
    noOptionsMessage = () => "Nenhuma opção encontrada"
}) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedValue, setSelectedValue] = useState([]);
    const [barcodeBuffer, setBarcodeBuffer] = useState(""); 
    const { autoCompleteFunction } = useAutocomplete();
    const { debouncedFn } = useDebounce(autoCompleteFunction, 500);

    const handleInputChange = (value) => {
        setInputValue(value);
        if (value) {
            debouncedFn(service, { columnDataBase, value, onBlurColumn }).then((results) => {
                setOptions(results);
            });
        } else {
            setOptions([]);
        }
    };

    const handleChange = (selected) => {
        const updatedValue = selected || [];
        setSelectedValue(updatedValue);

        if (onChange) {
            onChange(updatedValue, columnDataBase);
        }
    };

    const handleScanComplete = (barcodeString) => {
        if (!selectedValue.some((item) => item.value === barcodeString)) {
            const newItem = {
                column: columnDataBase,
                [onBlurColumn]: true,
                value: barcodeString,
                label: barcodeString,
            };
            const updatedValues = [...selectedValue, newItem];

            setSelectedValue(updatedValues);

            if (onChange) {
                onChange(updatedValues, columnDataBase);
            }
        }
        setBarcodeBuffer("");
        setInputValue('');
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && barcodeBuffer.length > 3) {
                handleScanComplete(barcodeBuffer);
            } else if (e.key.length === 1) {
                setBarcodeBuffer((prev) => prev + e.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [barcodeBuffer]);

    const handleBlur = () => {
        if (inputValue && !selectedValue.some((option) => option.label === inputValue)) {
            setSelectedValue([
                ...selectedValue,
                { [onBlurColumn]: true, value: inputValue, label: inputValue },
            ]);
        }

        setOptions([]);
        setInputValue("");
    };

    return (
        <Select
            isMulti={isMulti}
            options={options}
            isClearable={isClearable}
            value={value}
            inputValue={inputValue}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={onFocus}
            noOptionsMessage={noOptionsMessage}
            placeholder={placeholder}
        />
    );
};

export default AutoCompleteFilter;
