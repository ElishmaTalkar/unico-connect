import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '../../components/ui/Badge';

export const IssueCard = ({ issue, onClick, isOverlay }) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: issue.id,
        data: {
            type: 'Issue',
            issue
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.4 : 1,
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'red';
            case 'low': return 'blue';
            default: return 'gray';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`issue-card ${isOverlay ? 'issue-card-overlay' : ''}`}
            onClick={(e) => {
                // Ignore clicks if dragging (Dnd-kit handles this, but a safety check)
                if (isDragging) return;
                onClick?.(issue);
            }}
        >
            <div className="issue-card-header">
                <h4 className="issue-title">{issue.title}</h4>
            </div>
            {issue.description && (
                <p className="issue-description">{issue.description.substring(0, 60)}{issue.description.length > 60 ? '...' : ''}</p>
            )}

            <div className="issue-card-footer">
                <span className="issue-id">#{issue.id.substring(0, 8)}</span>
                <div className="issue-badges">
                    <Badge variant={getPriorityColor(issue.priority)}>
                        {issue.priority || 'medium'}
                    </Badge>
                </div>
            </div>
        </div>
    );
};
