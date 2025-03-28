import React, { createContext, useContext, useState, useEffect } from 'react';
import { GitlabOrganization, GitlabRepository } from '@/types/gitlab';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';

interface GitlabContextType {
  organizations: GitlabOrganization[];
  repositories: GitlabRepository[];
  activeOrg: GitlabOrganization | null;
  isLoading: boolean;
  error: string | null;
  addOrganization: (org: GitlabOrganization) => Promise<void>;
  removeOrganization: (orgId: string) => Promise<void>;
  setActiveOrganization: (org: GitlabOrganization | null) => void;
  addRepository: (repo: GitlabRepository) => Promise<void>;
  updateRepositoryStatus: (repoId: string, isActive: boolean, isSynced?: boolean) => Promise<void>;
  saveAccessToken: (orgId: string, token: string) => Promise<void>;
  importRepository: (repoData: { 
    name: string; 
    description?: string; 
    gitlabProjectId?: number;
    url?: string;
  }) => Promise<void>;
}

const GitlabContext = createContext<GitlabContextType | undefined>(undefined);

export const GitlabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<GitlabOrganization[]>([]);
  const [repositories, setRepositories] = useState<GitlabRepository[]>([]);
  const [activeOrg, setActiveOrg] = useState<GitlabOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedOrgs = localStorage.getItem('gitlab_organizations');
      const savedRepos = localStorage.getItem('gitlab_repositories');
      const savedActiveOrg = localStorage.getItem('gitlab_active_org');

      if (savedOrgs) setOrganizations(JSON.parse(savedOrgs));
      if (savedRepos) setRepositories(JSON.parse(savedRepos));
      if (savedActiveOrg) setActiveOrg(JSON.parse(savedActiveOrg));
    } catch (err) {
      console.error('Error loading saved GitLab data:', err);
      setError('Failed to load saved GitLab data');
    }
  }, []);

  useEffect(() => {
    if (organizations.length) {
      localStorage.setItem('gitlab_organizations', JSON.stringify(organizations));
    }
    if (repositories.length) {
      localStorage.setItem('gitlab_repositories', JSON.stringify(repositories));
    }
    if (activeOrg) {
      localStorage.setItem('gitlab_active_org', JSON.stringify(activeOrg));
    }
  }, [organizations, repositories, activeOrg]);

  const addOrganization = async (org: GitlabOrganization) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrganizations(prev => {
        const exists = prev.find(o => o.id === org.id);
        if (exists) return prev;
        return [...prev, org];
      });
      
      toast({
        title: "Organization added",
        description: `${org.name} has been successfully added`,
      });
      
      if (!activeOrg) {
        setActiveOrg(org);
      }
    } catch (err) {
      console.error('Error adding organization:', err);
      setError('Failed to add organization');
      toast({
        title: "Error",
        description: "Failed to add organization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeOrganization = async (orgId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrganizations(prev => prev.filter(org => org.id !== orgId));
      
      setRepositories(prev => prev.filter(repo => repo.organizationId !== orgId));
      
      if (activeOrg && activeOrg.id === orgId) {
        setActiveOrg(null);
      }
      
      toast({
        title: "Organization removed",
        description: "The organization has been successfully removed",
      });
    } catch (err) {
      console.error('Error removing organization:', err);
      setError('Failed to remove organization');
      toast({
        title: "Error",
        description: "Failed to remove organization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveOrganization = (org: GitlabOrganization | null) => {
    setActiveOrg(org);
  };

  const addRepository = async (repo: GitlabRepository) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRepositories(prev => {
        const exists = prev.find(r => r.id === repo.id);
        if (exists) return prev;
        return [...prev, repo];
      });
      
      toast({
        title: "Repository added",
        description: `${repo.name} has been successfully added`,
      });
    } catch (err) {
      console.error('Error adding repository:', err);
      setError('Failed to add repository');
      toast({
        title: "Error",
        description: "Failed to add repository",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRepositoryStatus = async (repoId: string, isActive: boolean, isSynced?: boolean) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRepositories(prev => 
        prev.map(repo => 
          repo.id === repoId 
            ? { ...repo, isActive, isSynced: isSynced !== undefined ? isSynced : repo.isSynced } 
            : repo
        )
      );
      
      toast({
        title: "Repository updated",
        description: `Repository status has been updated`,
      });
    } catch (err) {
      console.error('Error updating repository:', err);
      setError('Failed to update repository');
      toast({
        title: "Error",
        description: "Failed to update repository",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAccessToken = async (orgId: string, token: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrganizations(prev => 
        prev.map(org => 
          org.id === orgId 
            ? { ...org, accessToken: token } 
            : org
        )
      );
      
      if (activeOrg && activeOrg.id === orgId) {
        setActiveOrg({ ...activeOrg, accessToken: token });
      }
      
      toast({
        title: "Access token saved",
        description: "The GitLab access token has been successfully saved",
      });
    } catch (err) {
      console.error('Error saving access token:', err);
      setError('Failed to save access token');
      toast({
        title: "Error",
        description: "Failed to save access token",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const importRepository = async (repoData: { 
    name: string; 
    description?: string; 
    gitlabProjectId?: number;
    url?: string;
  }) => {
    try {
      if (!activeOrg) {
        throw new Error('No active organization selected');
      }

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newRepo: GitlabRepository = {
        id: nanoid(),
        organizationId: activeOrg.id,
        name: repoData.name,
        description: repoData.description,
        gitlabProjectId: repoData.gitlabProjectId,
        url: repoData.url,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      
      setRepositories(prev => {
        const exists = prev.find(r => r.gitlabProjectId === repoData.gitlabProjectId);
        if (exists) return prev;
        return [...prev, newRepo];
      });
      
      toast({
        title: "Repository imported",
        description: `${repoData.name} has been successfully imported`,
      });
    } catch (err) {
      console.error('Error importing repository:', err);
      setError('Failed to import repository');
      toast({
        title: "Error",
        description: "Failed to import repository",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    organizations,
    repositories,
    activeOrg,
    isLoading,
    error,
    addOrganization,
    removeOrganization,
    setActiveOrganization,
    addRepository,
    updateRepositoryStatus,
    saveAccessToken,
    importRepository,
  };

  return <GitlabContext.Provider value={value}>{children}</GitlabContext.Provider>;
};

export const useGitlab = () => {
  const context = useContext(GitlabContext);
  if (context === undefined) {
    throw new Error('useGitlab must be used within a GitlabProvider');
  }
  return context;
};
