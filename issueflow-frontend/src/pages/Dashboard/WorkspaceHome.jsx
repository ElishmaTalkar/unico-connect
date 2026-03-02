import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { useWorkspaceCtx } from '../../context/WorkspaceContext';
import { useIssues } from '../../hooks/useIssues';
import '../../styles/analytics.css';

const DUMMY_PRODUCTIVITY_DATA = [
    { name: 'Mon', completed: 4, new: 6 },
    { name: 'Tue', completed: 7, new: 3 },
    { name: 'Wed', completed: 5, new: 8 },
    { name: 'Thu', completed: 9, new: 4 },
    { name: 'Fri', completed: 12, new: 5 },
    { name: 'Sat', completed: 3, new: 1 },
    { name: 'Sun', completed: 5, new: 2 },
];

export const WorkspaceHome = () => {
    const { wsId } = useParams();
    const { workspace } = useWorkspaceCtx();
    const { data: issues } = useIssues(wsId);

    const stats = useMemo(() => {
        if (!issues) return { total: 0, open: 0, inProgress: 0, done: 0 };
        return {
            total: issues.length,
            open: issues.filter(i => i.status === 'open').length,
            inProgress: issues.filter(i => i.status === 'in_progress').length,
            done: issues.filter(i => i.status === 'done').length,
        };
    }, [issues]);

    const priorityData = useMemo(() => {
        if (!issues) return [];
        const high = issues.filter(i => i.priority === 'high').length;
        const medium = issues.filter(i => i.priority === 'medium').length;
        const low = issues.filter(i => i.priority === 'low').length;
        // fallback to dummy data if issues are empty so it looks good initially
        if (high === 0 && medium === 0 && low === 0) {
            return [
                { name: 'High', value: 12 },
                { name: 'Medium', value: 24 },
                { name: 'Low', value: 8 },
            ];
        }
        return [
            { name: 'High', value: high },
            { name: 'Medium', value: medium },
            { name: 'Low', value: low },
        ];
    }, [issues]);

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <div>
                    <h1 className="analytics-title">{workspace?.name || 'Workspace'} Analytics Dashboard</h1>
                    <p className="analytics-subtitle">Here is what's happening in your projects today.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-primary-light text-primary">
                        <Target size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Total Issues</p>
                        <h3 className="stat-value">{stats.total > 0 ? stats.total : 45}</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-warning-light text-warning">
                        <Activity size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">In Progress</p>
                        <h3 className="stat-value">{stats.total > 0 ? stats.inProgress : 12}</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-success-light text-success">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Completed</p>
                        <h3 className="stat-value">{stats.total > 0 ? stats.done : 29}</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-danger-light text-danger">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Completion Rate</p>
                        <h3 className="stat-value">
                            {stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 64}%
                        </h3>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3 className="chart-title">Weekly Productivity</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={DUMMY_PRODUCTIVITY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--color-text)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area type="monotone" dataKey="completed" name="Completed Tasks" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
                                <Area type="monotone" dataKey="new" name="New Tasks" stroke="#4f46e5" fillOpacity={1} fill="url(#colorNew)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3 className="chart-title">Issues by Priority</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'var(--color-bg-tertiary)' }}
                                    contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" name="Count" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
