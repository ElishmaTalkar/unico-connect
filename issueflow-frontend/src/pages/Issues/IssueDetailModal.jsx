import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useComments } from '../../hooks/useComments';
import { MessageSquare, Calendar, User, Tag, ArrowUpCircle, Edit2 } from 'lucide-react';
import '../../styles/issueDetail.css';

export const IssueDetailModal = ({ isOpen, onClose, wsId, issue, onEdit }) => {
    const { data: comments, addComment, isAdding } = useComments(wsId, issue?.id);
    const [commentText, setCommentText] = useState('');

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addComment(commentText.trim(), {
            onSuccess: () => setCommentText(''),
        });
    };

    if (!issue) return null;

    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'red';
            case 'low': return 'blue';
            default: return 'gray';
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'open': return 'blue';
            case 'in_progress': return 'yellow';
            case 'done': return 'green';
            default: return 'gray';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Issue Detail - #${issue.id.substring(0, 8)}`} width="800px">
            <div className="issue-detail-content">
                <div className="issue-main-info">
                    <div className="issue-header-row">
                        <h2 className="detail-title">{issue.title}</h2>
                        <div className="detail-badges">
                            <Badge variant={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                            <Badge variant={getStatusColor(issue.status)}>{issue.status?.replace('_', ' ')}</Badge>
                            <button className="edit-issue-btn" onClick={() => onEdit(issue)} title="Edit Issue">
                                <Edit2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="detail-meta-grid">
                        <div className="meta-item-box">
                            <Tag size={16} className="text-muted" />
                            <span>Project: {issue.project_name || 'None'}</span>
                        </div>
                        <div className="meta-item-box">
                            <Calendar size={16} className="text-muted" />
                            <span>Created: {new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="meta-item-box">
                            <User size={16} className="text-muted" />
                            <span>Assignee: {issue.assignee_name || 'Unassigned'}</span>
                        </div>
                        <div className="meta-item-box">
                            <ArrowUpCircle size={16} className="text-muted" />
                            <span>Reporter: {issue.reporter_name}</span>
                        </div>
                    </div>

                    <div className="detail-description-section">
                        <h4 className="detail-section-title">Description</h4>
                        <div className="detail-description-text">
                            {issue.description || <p className="text-muted">No description provided.</p>}
                        </div>
                    </div>

                    <div className="detail-comments-section">
                        <div className="comments-header">
                            <MessageSquare size={20} />
                            <h4 className="detail-section-title">Comments ({comments?.length || 0})</h4>
                        </div>

                        <div className="comments-list">
                            {comments?.map(comment => (
                                <div key={comment.id} className="comment-item">
                                    <Avatar name={comment.user_name} size="sm" />
                                    <div className="comment-body">
                                        <div className="comment-meta">
                                            <span className="comment-author">{comment.user_name}</span>
                                            <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className="comment-text">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                            {comments?.length === 0 && (
                                <p className="empty-comments">No comments yet. Start the conversation!</p>
                            )}
                        </div>

                        <form onSubmit={handleAddComment} className="comment-form">
                            <textarea
                                className="comment-textarea"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <div className="comment-form-actions">
                                <Button type="submit" variant="primary" size="sm" isLoading={isAdding} disabled={!commentText.trim()}>
                                    Post Comment
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
