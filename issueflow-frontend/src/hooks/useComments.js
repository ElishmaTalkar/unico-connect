import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment } from '../api/comments.api';

export const useComments = (wsId, issueId) => {
    const queryClient = useQueryClient();

    const commentsQuery = useQuery({
        queryKey: ['comments', wsId, issueId],
        queryFn: () => getComments(wsId, issueId),
        enabled: !!wsId && !!issueId,
    });

    const addCommentMutation = useMutation({
        mutationFn: (text) => addComment(wsId, issueId, { content: text }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', wsId, issueId] });
        },
    });

    return {
        ...commentsQuery,
        addComment: addCommentMutation.mutate,
        isAdding: addCommentMutation.isPending,
    };
};
