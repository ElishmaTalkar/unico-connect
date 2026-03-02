import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import '../../styles/components.css';

export const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className = '',
    type = 'button',
    ...props
}, ref) => {

    const baseClasses = 'btn';
    const variantClasses = `btn-${variant}`;
    const sizeClasses = `btn-${size}`;
    const allDisabled = disabled || isLoading;

    return (
        <button
            ref={ref}
            type={type}
            disabled={allDisabled}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
            {...props}
        >
            {isLoading && <Loader2 className="btn-spinner" size={16} />}
            <span className={isLoading ? 'btn-content-hidden' : ''}>{children}</span>
        </button>
    );
});

Button.displayName = 'Button';
