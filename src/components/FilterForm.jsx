import React from "react";
import Button from "./Button";

const FilterForm = ({ autoCompleteFields, onSubmit, onClear }) => {
    return (
        <form className="form-row p-3 rounded shadow-sm mb-2 theme-background" onSubmit={onSubmit}>
            {autoCompleteFields.map(({ label, component }, index) => (
                <div
                    className={`form-group ${autoCompleteFields.length % 2 !== 0 && index === autoCompleteFields.length - 1 ? 'col-md-12' : 'col-md-6'}`}
                    key={index}
                >
                    <label className="text-dark font-weight-bold mt-1">{label}:</label>
                    {component}
                </div>
            ))}

            <div className="form-group gap-2">
                <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={onClear} />
            </div>
        </form>
    );
};

export default FilterForm;
