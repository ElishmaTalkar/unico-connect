import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useIssues } from '../../hooks/useIssues';
import { updateIssue } from '../../api/issues.api';
import { KanbanColumn } from './KanbanColumn';
import { IssueCard } from './IssueCard';
import { IssueModal } from './IssueModal';
import { IssueDetailModal } from './IssueDetailModal';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import '../../styles/kanban.css';

const COLUMNS = [
    { id: 'open', title: 'Open' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
];

export const IssuesBoard = () => {
    const { wsId } = useParams();
    const { data: issues, isLoading, refetch } = useIssues(wsId);
    const { push } = useToast();

    const [activeId, setActiveId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewingIssue, setViewingIssue] = useState(null);
    const [editingIssue, setEditingIssue] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const columnsWithIssues = useMemo(() => {
        const board = COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: [] }), {});
        if (issues) {
            issues.forEach(issue => {
                const status = issue.status || 'open';
                if (board[status]) board[status].push(issue);
            });
        }
        return board;
    }, [issues]);

    const activeIssue = useMemo(
        () => issues?.find(issue => issue.id === activeId),
        [activeId, issues]
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find the issue
        const draggedIssue = issues.find(i => i.id === activeId);
        if (!draggedIssue) return;

        // Is it dropped over a column?
        const isOverColumn = COLUMNS.some(col => col.id === overId);
        let newStatus = draggedIssue.status;

        if (isOverColumn) {
            newStatus = overId;
        } else {
            // Dropped over another issue
            const overIssue = issues.find(i => i.id === overId);
            if (overIssue) {
                newStatus = overIssue.status;
            }
        }

        if (draggedIssue.status !== newStatus) {
            // Optimistically update the UI conceptually (we refetch to make it simpler)
            try {
                await updateIssue(wsId, activeId, { status: newStatus });
                refetch();
            } catch (err) {
                push('Failed to update issue status', 'error');
            }
        }
    };

    if (isLoading) return <div className="kanban-loading">Loading board...</div>;

    return (
        <div className="kanban-container">
            <div className="kanban-header">
                <div>
                    <h1 className="kanban-title">Issues Board</h1>
                    <p className="kanban-subtitle">Manage workspace issues and progress.</p>
                </div>
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={18} className="btn-icon" /> New Issue
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="kanban-board">
                    {COLUMNS.map(col => (
                        <SortableContext
                            key={col.id}
                            id={col.id}
                            items={columnsWithIssues[col.id].map(i => i.id)}
                        >
                            <KanbanColumn
                                id={col.id}
                                title={col.title}
                                issues={columnsWithIssues[col.id]}
                                onView={(issue) => setViewingIssue(issue)}
                            />
                        </SortableContext>
                    ))}
                </div>

                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeIssue ? <IssueCard issue={activeIssue} isOverlay /> : null}
                </DragOverlay>
            </DndContext>

            <IssueModal
                isOpen={isCreateModalOpen || !!editingIssue}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingIssue(null);
                }}
                wsId={wsId}
                initialData={editingIssue}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    setEditingIssue(null);
                    refetch();
                }}
            />

            <IssueDetailModal
                isOpen={!!viewingIssue}
                onClose={() => setViewingIssue(null)}
                wsId={wsId}
                issue={viewingIssue}
                onEdit={(issue) => {
                    setViewingIssue(null);
                    setEditingIssue(issue);
                }}
            />
        </div>
    );
};
