import '../../styles/components.css';

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

export const Avatar = ({ name, email, src, size = 'md', className = '' }) => {
    const sizeClass = `avatar-${size}`;

    return (
        <div
            className={`avatar ${sizeClass} ${className}`}
            title={name || email || 'User Profile'}
        >
            {src ? (
                <img src={src} alt={name || 'User avatar'} className="avatar-img" />
            ) : (
                <span className="avatar-initials">{getInitials(name || email)}</span>
            )}
        </div>
    );
};
