
export interface GitlabOrganization {
  id: string;
  teamId: string;
  name: string;
  url: string;
  installationId?: number;
  accessToken?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GitlabRepository {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  isActive: boolean;
  isSynced?: boolean;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  gitlabProjectId?: number; // GitLab's native project ID
}

export interface PullRequestContext {
  id: number;
  title: string;
  number: number;
  url: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: string;
  updatedAt: string;
  repo: string;
  orgName: string;
}

export type GitProvider = 'gitlab' | 'github';

// GitLab API response types
export interface GitlabProjectResponse {
  id: number;
  name: string;
  description: string;
  web_url: string;
  path_with_namespace: string;
  default_branch: string;
  visibility: string;
  star_count: number;
  forks_count: number;
  last_activity_at: string;
  namespace: {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
  };
}

