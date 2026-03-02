import { useQuery } from '@tanstack/react-query';
import { getIssues } from '../api/issues.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useIssues = (workspaceId, filters = {}) =>
    useQuery({
        queryKey: QUERY_KEYS.issues(workspaceId, filters),
        queryFn: () => getIssues(workspaceId, filters),
        enabled: !!workspaceId,
    });
