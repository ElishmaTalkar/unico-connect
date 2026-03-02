import { useQuery } from '@tanstack/react-query';
import { getMembers } from '../api/members.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useMembers = (workspaceId) =>
    useQuery({
        queryKey: QUERY_KEYS.members(workspaceId),
        queryFn: () => getMembers(workspaceId),
        enabled: !!workspaceId,
    });
