export const QUERY_KEYS = {
    workspace: (id) => ['workspace', id],
    projects: (wsId) => ['projects', wsId],
    members: (wsId) => ['members', wsId],
    issues: (wsId, f) => ['issues', wsId, f ?? {}],
    issue: (wsId, id) => ['issue', wsId, id],
    comments: (issueId) => ['comments', issueId],
};
