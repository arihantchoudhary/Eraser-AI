
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useGitlab } from '@/contexts/GitlabContext';
import { GitlabProjectResponse } from '@/types/gitlab';
import { Loader2, GitBranch, Import } from 'lucide-react';

const GitlabImport: React.FC = () => {
  const [projectId, setProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<GitlabProjectResponse | null>(null);
  const { toast } = useToast();
  const { activeOrg, importRepository } = useGitlab();

  const handleFetchProject = async () => {
    if (!projectId || !activeOrg?.accessToken) {
      toast({
        title: "Validation Error",
        description: "Project ID and access token are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = activeOrg.url.includes('gitlab.com') 
        ? `https://gitlab.com/api/v4/projects/${projectId}`
        : `${activeOrg.url}/api/v4/projects/${projectId}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${activeOrg.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching project: ${response.statusText}`);
      }

      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to fetch GitLab project. Check the project ID and your access token.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!project || !activeOrg) {
      return;
    }

    try {
      await importRepository({
        name: project.path_with_namespace,
        description: project.description,
        gitlabProjectId: project.id,
        url: project.web_url,
      });

      toast({
        title: "Success!",
        description: `Repository ${project.name} has been imported`,
      });
      setProject(null);
      setProjectId('');
    } catch (error) {
      console.error('Error importing repository:', error);
      toast({
        title: "Error",
        description: "Failed to import repository",
        variant: "destructive",
      });
    }
  };

  if (!activeOrg?.accessToken) {
    return (
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <GitBranch className="h-5 w-5" />
          <h3 className="font-medium">GitLab Repository Import</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You need to configure a GitLab organization with an access token before importing repositories.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Import className="h-5 w-5 text-green-600" />
        <h3 className="font-medium">Import GitLab Repository</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Enter the GitLab project ID to import. You can find this ID on your project page under the project name.
      </p>
      
      <div className="flex items-end gap-2 mb-4">
        <div className="flex-grow">
          <Label htmlFor="projectId" className="mb-2 block">Project ID</Label>
          <Input 
            id="projectId" 
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="e.g., 12345678"
          />
        </div>
        <Button onClick={handleFetchProject} disabled={isLoading} className="mb-[1px]">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Fetch Project
        </Button>
      </div>

      {project && (
        <div className="border p-3 rounded-md bg-gray-50 mb-4">
          <h4 className="font-medium mb-2">{project.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{project.description || 'No description'}</p>
          <div className="text-xs text-gray-500 mb-2">ID: {project.id}</div>
          <div className="text-xs text-gray-500 mb-4">Path: {project.path_with_namespace}</div>
          <Button onClick={handleImport} size="sm">
            Import Repository
          </Button>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        Note: Make sure your personal access token has the API scope and access to the project.
      </div>
    </div>
  );
};

export default GitlabImport;
