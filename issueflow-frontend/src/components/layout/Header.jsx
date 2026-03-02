import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Search, Bell } from 'lucide-react';
import { Input } from '../ui/Input';

export const Header = () => {
    const { dark, toggle } = useTheme();
    const { user } = useAuth();

    return (
        <header className="app-header">
            <div className="header-left">
                {/* Search or breadcrumbs could go here */}
                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input type="text" placeholder="Search across workspace..." className="search-input" />
                </div>
            </div>

            <div className="header-right">
                <button className="icon-btn" title="Toggle Theme" onClick={toggle}>
                    {dark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="icon-btn" title="Notifications">
                    <Bell size={20} />
                </button>
            </div>
        </header>
    );
};
