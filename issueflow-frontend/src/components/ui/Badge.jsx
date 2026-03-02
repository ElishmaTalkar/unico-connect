import '../../styles/components.css';

export const Badge = ({ children, variant = 'gray', className = '' }) => {
    const variantClass = `badge-${variant}`;

    return (
        <span className={`badge ${variantClass} ${className}`}>
            {children}
        </span>
    );
};
