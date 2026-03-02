import { forwardRef } from 'react';
import '../../styles/components.css'; // Assuming we'll add some generic classes, or we just write inline/css modules

export const Input = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
    const defaultId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={defaultId} className="input-label">
                    {label}
                </label>
            )}
            <input
                id={defaultId}
                ref={ref}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';
