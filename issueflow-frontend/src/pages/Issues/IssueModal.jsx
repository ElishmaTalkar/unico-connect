import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createIssue, updateIssue } from '../../api/issues.api';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const IssueModal = ({ isOpen, onClose, wsId, initialData, onSuccess }) => {
    const isEditing = !!initialData;
    const { push } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            status: 'open',
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    title: initialData.title || '',
                    description: initialData.description || '',
                    priority: initialData.priority || 'medium',
                    status: initialData.status || 'open',
                });
            } else {
                reset({
                    title: '',
                    description: '',
                    priority: 'medium',
                    status: 'open',
                });
            }
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (isEditing) {
                await updateIssue(wsId, initialData.id, data);
                push('Issue updated successfully', 'success');
            } else {
                await createIssue(wsId, data);
                push('Issue created successfully', 'success');
            }
            onSuccess();
        } catch (error) {
            push(`Failed to ${isEditing ? 'update' : 'create'} issue`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Issue' : 'Create New Issue'}>
            <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
                <Input
                    label="Title"
                    placeholder="Brief description of the issue"
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title is too short' } })}
                />

                <div className="input-field">
                    <label className="input-label">Description</label>
                    <textarea
                        className="input-element"
                        placeholder="Detailed explanation..."
                        style={{ minHeight: '100px', resize: 'vertical' }}
                        {...register('description')}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Select
                        label="Priority"
                        options={[
                            { value: 'low', label: 'Low' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'high', label: 'High' }
                        ]}
                        {...register('priority')}
                    />

                    <Select
                        label="Status"
                        options={[
                            { value: 'open', label: 'Open' },
                            { value: 'in_progress', label: 'In Progress' },
                            { value: 'done', label: 'Done' }
                        ]}
                        {...register('status')}
                    />
                </div>

                <div className="modal-actions" style={{ marginTop: '2rem' }}>
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        {isEditing ? 'Save Changes' : 'Create Issue'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
