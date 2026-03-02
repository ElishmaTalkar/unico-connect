import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIssue } from '../api/issues.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useCreateIssue = (workspaceId) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => createIssue(workspaceId, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['issues', workspaceId] });
        },
    });
};
