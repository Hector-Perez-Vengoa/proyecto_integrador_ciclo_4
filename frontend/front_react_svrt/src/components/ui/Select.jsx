// src/components/ui/Select.jsx
const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Seleccionar...', 
  error,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="py-2"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
