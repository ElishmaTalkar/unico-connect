import { useQuery } from '@tanstack/react-query';
import { getIssue } from '../api/issues.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useIssue = (workspaceId, id) =>
    useQuery({
        queryKey: QUERY_KEYS.issue(workspaceId, id),
        queryFn: () => getIssue(workspaceId, id),
        enabled: !!workspaceId && !!id,
    });
