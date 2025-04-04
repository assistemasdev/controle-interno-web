const DynamicHeaderForm = ({ options, selectedOption, onChange }) => {
    return (
        <div className="flex justify-between items-center rounded shadow-sm p-2 rounded-lg mb-2">
            <select
                className="form-select px-4 py-1 border rounded-lg bg-white"
                value={selectedOption}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DynamicHeaderForm