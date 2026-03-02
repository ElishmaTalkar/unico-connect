import { useQuery } from '@tanstack/react-query';
import { getWorkspace } from '../api/workspaces.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useWorkspace = (workspaceId) =>
    useQuery({
        queryKey: QUERY_KEYS.workspace(workspaceId),
        queryFn: () => getWorkspace(workspaceId),
        enabled: !!workspaceId,
    });
