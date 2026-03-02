import { createContext, useContext, useState, useCallback } from 'react';

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
    const [workspaceId, setWorkspaceId] = useState(
        () => localStorage.getItem('workspaceId') || null
    );
    const [workspace, setWorkspace] = useState(null);

    const enterWorkspace = useCallback((id, wsObj) => {
        localStorage.setItem('workspaceId', id);
        setWorkspaceId(id);
        if (wsObj) setWorkspace(wsObj);
    }, []);

    const clearWorkspace = useCallback(() => {
        localStorage.removeItem('workspaceId');
        setWorkspaceId(null);
        setWorkspace(null);
    }, []);

    return (
        <WorkspaceContext.Provider value={{ workspaceId, workspace, setWorkspace, enterWorkspace, clearWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspaceCtx = () => {
    const ctx = useContext(WorkspaceContext);
    if (!ctx) throw new Error('useWorkspaceCtx must be used inside WorkspaceProvider');
    return ctx;
};
