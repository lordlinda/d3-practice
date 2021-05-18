export const Dropdown = ({ options, selectedValue, onSelectedValueChange }) => (
  <select
    defaultValue={selectedValue}
    onChange={(e) => onSelectedValueChange(e.target.value)}
  >
    {options.map(({ value, label }) => (
      <option value={value} key={value}>
        {label}
      </option>
    ))}
  </select>
);
