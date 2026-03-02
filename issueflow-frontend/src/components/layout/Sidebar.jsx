import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Settings,
    LogOut,
    Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspaceCtx } from '../../context/WorkspaceContext';

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const { workspaceId, clearWorkspace } = useWorkspaceCtx();

    const handleLogout = () => {
        clearWorkspace();
        logout();
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <CheckSquare size={24} className="text-primary" />
                    <span>IssueFlow</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <p className="nav-section-title">General</p>
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                </div>

                {workspaceId && (
                    <div className="nav-section">
                        <p className="nav-section-title">Workspace</p>
                        <NavLink
                            to={`/workspace/${workspaceId}/issues`}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Briefcase size={20} />
                            <span>Issues</span>
                        </NavLink>
                    </div>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="user-info">
                        <p className="user-name">{user?.name || 'User'}</p>
                        <p className="user-email">{user?.email}</p>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
        </aside>
    );
};
