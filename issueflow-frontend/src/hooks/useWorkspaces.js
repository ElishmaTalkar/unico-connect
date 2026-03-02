import { useQuery } from '@tanstack/react-query';
import { getUserWorkspaces } from '../api/workspaces.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useWorkspaces = () => {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: getUserWorkspaces,
    });
};
