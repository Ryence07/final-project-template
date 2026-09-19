function SelectField({ label, value, options, onChange }) {
    return (
        <label className="select-field">
            <span>{label}</span>

            <select value={value} onChange={onChange} required>
                <option value="">Select {label}</option>

                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    )
}

export default SelectField
