# IssueFlow Architecture

## Why This Stack?

### Frontend
- **React 19 & Vite:** Leverages the latest React features and a super-fast build tool for an optimal developer experience and performance.
- **React Query (@tanstack/react-query):** Handles all asynchronous state management, providing caching, background updates, and stale-time logic out of the box.
- **Axios:** Robust HTTP client for API communication.
- **dnd-kit:** A lightweight, performant, and accessible drag-and-drop library used for the Kanban board.
- **Lucide React:** A clean and consistent icon set.
- **Recharts:** Specifically chosen for its declarative approach to building complex data visualizations for analytics.

### Backend
- **Node.js & Express.js (v5):** A lightweight yet powerful framework for building RESTful APIs.
- **PostgreSQL:** Reliable relational database to manage complex relationships between users, workspaces, projects, and issues.
- **JWT & BcryptJS:** Secure authentication and password hashing.
- **WebSockets (ws):** Used for real-time communication (e.g., live analytics or board updates).

## Database Schema

- **`users`**: Stores user profiles and authentication data.
- **`workspaces`**: The top-level container for projects and issues. Each workspace has a unique join code.
- **`workspace_members`**: Link table for Users and Workspaces, supporting roles (`admin`, `member`).
- **`projects`**: Sub-groupings within workspaces for better organization.
- **`issues`**: The core entity. Tracks status, priority, assignments, and metadata.
- **`comments`**: Enables collaboration on individual issues.

## API Endpoints List

### Auth (`/api/auth`)
- `POST /signup`: Register a new user.
- `POST /login`: Authenticate and receive a JWT.
- `GET /me`: Get current authenticated user details.

### Workspaces (`/api/workspaces`)
- `GET /`: List all workspaces the user belongs to.
- `POST /`: Create a new workspace.
- `POST /join`: Join a workspace using a 6-character code.
- `GET /:workspaceId`: Get workspace details.

### Projects (`/api/workspaces/:workspaceId/projects`)
- `GET /`: List projects in a workspace.
- `POST /`: Create a project.

### Issues (`/api/workspaces/:workspaceId/issues`)
- `GET /`: List issues (supports filtering/sorting).
- `GET /export`: Download issues as CSV.
- `POST /`: Create a new issue.
- `GET /:id`: Get specific issue details.
- `PATCH /:id`: Update issue status, priority, or details.
- `DELETE /:id`: Remove an issue.

### Comments (`/api/workspaces/:workspaceId/issues/:issueId/comments`)
- `GET /`: List comments for an issue.
- `POST /`: Add a comment.

### Members (`/api/workspaces/:workspaceId/members`)
- `GET /`: List all members of the workspace.

## Component Structure

- **`src/pages/`**: High-level page components (Login, Dashboard, WorkspaceHome, IssuesBoard).
- **`src/components/layout/`**: Shared structure including the `Sidebar`, `Topbar`, and main `Layout` wrapper.
- **`src/components/ui/`**: Reusable atomic components (Button, Input, Modal, Badge, Toast).
- **`src/components/issues/`**: Components specifically for issue management (IssueCard, IssueDetails, CreateIssueForm).
- **`src/components/kanban/`**: Board-specific components and drag-and-drop logic.
- **`src/components/analytics/`**: Data visualization components for the dashboard.
- **`src/context/`**: Global state providers (Auth, Toast, Workspace).
- **`src/hooks/`**: Custom hooks for API calls and shared logic.

## What I’d Improve with More Time

1. **Full Real-time Synchronization**: Fully integrate WebSockets into the frontend to update the Kanban board and notifications instantly when other users make changes.
2. **Granular Permissions**: Move beyond simple workspace roles to project-level permissions and custom roles.
3. **Advanced Filtering & Search**: Implement a full-text search engine (e.g., PostgreSQL tsvector or Meilisearch) and advanced filter builders.
4. **Testing Suite**: Add comprehensive unit tests (Vitest), component tests (React Testing Library), and E2E tests (Playwright).
5. **Dark Mode & Theming**: Implement a robust theme system using CSS variables and a theme provider.
6. **File Attachments**: Add support for uploading screenshots and documents to issues using an S3-compatible storage provider.
7. **Activity Feed**: A comprehensive audit log and activity feed for workspaces and individual issues.
