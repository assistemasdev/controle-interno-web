import React, { useState, useEffect } from "react";
import Button from "./Button";
import useDebounce from "../hooks/useDebounce";

const Form = ({
    children, 
    onSubmit, 
    className = "", 
    debounceTime = 1000,
    handleChange, 
    textSubmit,
    textLoadingSubmit,
    handleBack,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { debouncedFn: debouncedSubmit, isPending } = useDebounce(async (data) => {
        await onSubmit(data);
    }, debounceTime);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        debouncedSubmit().finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <form className={`p-3 rounded shadow-sm ${className}`} onSubmit={handleSubmit}>
            {children({ handleChange })}
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
