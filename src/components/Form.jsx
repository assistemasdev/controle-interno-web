import React, { useState, useEffect } from "react";
import Button from "./Button";
import useDebounce from "../hooks/useDebounce";

const Form = ({
    children,
    onSubmit,
    initialFormData = {}, 
    className = "",
    debounceTime = 1000,
    handleChange, 
    textSubmit,
    textLoadingSubmit,
    handleBack,
}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { debouncedFn: debouncedSubmit, isPending } = useDebounce(async (data) => {
        await onSubmit(data);
    }, debounceTime);
    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    const defaultHandleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const changeHandler = handleChange || defaultHandleChange;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        debouncedSubmit(formData).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <form className={`p-3 rounded shadow-sm ${className}`} onSubmit={handleSubmit}>
            {children({ formData, handleChange: changeHandler })}
            <div className="mt-3 form-row gap-2">
                <Button
                    type="submit"
                    text={isSubmitting || isPending ? textLoadingSubmit : textSubmit}
                    className={`btn btn-blue-light fw-semibold ${isSubmitting || isPending ? "disabled" : ""}`}
                    disabled={isSubmitting || isPending}
                />
                <Button
                    type="button"
                    text="Voltar"
                    className="btn btn-blue-light fw-semibold"
                    onClick={handleBack}
                />
            </div>
        </form>
    );
};

export default Form;
