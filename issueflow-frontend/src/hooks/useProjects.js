import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api/projects.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useProjects = (workspaceId) =>
    useQuery({
        queryKey: QUERY_KEYS.projects(workspaceId),
        queryFn: () => getProjects(workspaceId),
        enabled: !!workspaceId,
    });
