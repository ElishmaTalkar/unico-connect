import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IssueCard } from './IssueCard';

export const KanbanColumn = ({ id, title, issues, onEdit }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'Column',
            columnId: id
        }
    });

    return (
        <div className={`kanban-column ${isOver ? 'kanban-column-over' : ''}`}>
            <div className="kanban-column-header">
                <h3 className="kanban-column-title">
                    {title} <span className="kanban-column-count">{issues.length}</span>
                </h3>
            </div>

            <div
                ref={setNodeRef}
                className="kanban-column-body"
            >
                <SortableContext
                    items={issues.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {issues.map(issue => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onClick={() => onEdit(issue)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};
