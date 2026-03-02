import { forwardRef } from 'react';
import '../../styles/components.css';

export const Select = forwardRef(({ label, error, className = '', id, options, ...props }, ref) => {
    const defaultId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={defaultId} className="input-label">
                    {label}
                </label>
            )}
            <select
                id={defaultId}
                ref={ref}
                className={`input-field select-field ${error ? 'input-error' : ''}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
});

Select.displayName = 'Select';
