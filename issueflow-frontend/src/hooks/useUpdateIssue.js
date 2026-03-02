import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIssue } from '../api/issues.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useUpdateIssue = (workspaceId) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateIssue(workspaceId, id, data),
        onMutate: async ({ id, data }) => {
            await qc.cancelQueries({ queryKey: QUERY_KEYS.issue(workspaceId, id) });
            const previous = qc.getQueryData(QUERY_KEYS.issue(workspaceId, id));
            qc.setQueryData(QUERY_KEYS.issue(workspaceId, id), (old) => old ? { ...old, ...data } : old);
            return { previous, id };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.previous) qc.setQueryData(QUERY_KEYS.issue(workspaceId, ctx.id), ctx.previous);
        },
        onSettled: (_data, _err, { id }) => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.issue(workspaceId, id) });
            qc.invalidateQueries({ queryKey: ['issues', workspaceId] });
        },
    });
};
