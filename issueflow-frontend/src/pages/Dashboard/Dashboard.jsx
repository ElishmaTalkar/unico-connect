import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Users } from 'lucide-react';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useWorkspaceCtx } from '../../context/WorkspaceContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { createWorkspace, joinWorkspace } from '../../api/workspaces.api';
import { useToast } from '../../context/ToastContext';
import '../../styles/dashboard.css';

export const Dashboard = () => {
    const { data: workspaces, isLoading, refetch } = useWorkspaces();
    const { enterWorkspace } = useWorkspaceCtx();
    const navigate = useNavigate();
    const { push } = useToast();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const { register: registerCreate, handleSubmit: handleCreateSubmit, reset: resetCreate, formState: { errors: createErrors } } = useForm();
    const { register: registerJoin, handleSubmit: handleJoinSubmit, reset: resetJoin, formState: { errors: joinErrors } } = useForm();

    const onSelectWorkspace = (ws) => {
        enterWorkspace(ws.id, ws);
        navigate(`/workspace/${ws.id}`);
    };

    const onCreateWorkspace = async (data) => {
        setActionLoading(true);
        try {
            const newWs = await createWorkspace(data);
            push('Workspace created successfully', 'success');
            setIsCreateModalOpen(false);
            resetCreate();
            refetch();
        } catch (error) {
            push(error.response?.data?.error || 'Failed to create workspace', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const onJoinWorkspace = async (data) => {
        setActionLoading(true);
        try {
            await joinWorkspace(data);
            push('Joined workspace successfully', 'success');
            setIsJoinModalOpen(false);
            resetJoin();
            refetch();
        } catch (error) {
            push(error.response?.data?.error || 'Failed to join workspace', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Your Workspaces</h1>
                    <p className="dashboard-subtitle">Select a workspace to view projects and issues.</p>
                </div>
                <div className="dashboard-actions">
                    <Button variant="secondary" onClick={() => setIsJoinModalOpen(true)}>
                        Join Workspace
                    </Button>
                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={18} className="btn-icon" />
                        Create Workspace
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-state">Loading workspaces...</div>
            ) : workspaces?.length > 0 ? (
                <div className="workspaces-grid">
                    {workspaces.map((ws) => (
                        <div key={ws.id} className="workspace-card" onClick={() => onSelectWorkspace(ws)}>
                            <div className="workspace-card-header">
                                <div className="workspace-icon">
                                    <Briefcase size={24} />
                                </div>
                                <Badge variant={ws.role === 'admin' ? 'blue' : 'gray'}>
                                    {ws.role}
                                </Badge>
                            </div>
                            <h3 className="workspace-name">{ws.name}</h3>
                            <div className="workspace-meta">
                                <span className="meta-item">
                                    <Users size={16} /> Joined {new Date(ws.joined_at).toLocaleDateString()}
                                </span>
                                {ws.role === 'admin' && (
                                    <span className="workspace-code">Code: {ws.code}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon-wrapper">
                        <Briefcase size={48} className="text-muted" />
                    </div>
                    <h2>No workspaces found</h2>
                    <p>Get started by creating a new workspace or joining an existing one.</p>
                </div>
            )}

            {/* Create Workspace Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Workspace">
                <form onSubmit={handleCreateSubmit(onCreateWorkspace)} className="modal-form">
                    <Input
                        label="Workspace Name"
                        placeholder="e.g. Engineering Team"
                        error={createErrors.name?.message}
                        {...registerCreate('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                    />
                    <div className="modal-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" isLoading={actionLoading}>Create Workspace</Button>
                    </div>
                </form>
            </Modal>

            {/* Join Workspace Modal */}
            <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Join Workspace">
                <form onSubmit={handleJoinSubmit(onJoinWorkspace)} className="modal-form">
                    <Input
                        label="Invite Code"
                        placeholder="e.g. A1B2C3"
                        error={joinErrors.code?.message}
                        {...registerJoin('code', { required: 'Code is required', pattern: { value: /^[A-Z0-9]{6}$/, message: 'Invalid 6-character code' } })}
                        onChange={(e) => { e.target.value = e.target.value.toUpperCase(); }}
                    />
                    <p className="text-sm text-muted">Ask an admin of the workspace for the 6-character invite code.</p>
                    <div className="modal-actions">
                        <Button variant="secondary" onClick={() => setIsJoinModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" isLoading={actionLoading}>Join Workspace</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
