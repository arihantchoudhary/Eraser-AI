
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGitlab } from '@/contexts/GitlabContext';
import { GitlabOrganization, GitlabRepository } from '@/types/gitlab';
import { nanoid } from 'nanoid';
import { Link, GitBranch, Github, GitPullRequestDraft, GitMerge, Import } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GitlabImport from '@/components/GitlabImport';

const GitConnect: React.FC = () => {
  const { organizations, repositories, activeOrg, addOrganization, addRepository, updateRepositoryStatus, saveAccessToken } = useGitlab();
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationUrl, setOrganizationUrl] = useState('');
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const { toast } = useToast();

  const mockRepos = [
    { id: '1', name: 'eraserlabs/eraser' },
    { id: '2', name: 'eraserlabs/terraform-examples' },
    { id: '3', name: 'shinkim/shin-test' },
  ];

  const handleConnectOrg = () => {
    if (!organizationName || !organizationUrl) {
      toast({
        title: "Validation Error",
        description: "Organization name and URL are required",
        variant: "destructive",
      });
      return;
    }

    const newOrg: GitlabOrganization = {
      id: nanoid(),
      teamId: 'team_' + nanoid(8),
      name: organizationName,
      url: organizationUrl,
      createdAt: new Date().toISOString(),
    };

    addOrganization(newOrg);
    setShowConnectDialog(false);
    setOrganizationName('');
    setOrganizationUrl('');
  };

  const handleSaveToken = () => {
    if (!accessToken || !activeOrg) {
      toast({
        title: "Validation Error",
        description: "Access token is required and an organization must be selected",
        variant: "destructive",
      });
      return;
    }

    saveAccessToken(activeOrg.id, accessToken);
    setShowTokenDialog(false);
    setAccessToken('');
  };

  const handleAddRepositories = () => {
    if (!selectedRepos.length || !activeOrg) {
      toast({
        title: "Validation Error",
        description: "Select at least one repository and ensure an organization is active",
        variant: "destructive",
      });
      return;
    }

    selectedRepos.forEach(repoName => {
      const newRepo: GitlabRepository = {
        id: nanoid(),
        name: repoName,
        organizationId: activeOrg.id,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      addRepository(newRepo);
    });

    setSelectedRepos([]);
    toast({
      title: "Repositories Added",
      description: `${selectedRepos.length} repositories have been added`,
    });
  };

  const handleToggleRepo = (repoId: string) => {
    if (selectedRepos.includes(repoId)) {
      setSelectedRepos(selectedRepos.filter(id => id !== repoId));
    } else {
      setSelectedRepos([...selectedRepos, repoId]);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Git Connect</h1>
        <Button onClick={() => setShowConnectDialog(true)}>
          Connect new Git Org
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Github className="w-6 h-6 text-black" />
          <GitBranch className="w-6 h-6 text-gitlab-orange" />
          <Link className="w-6 h-6 text-blue-500" />
          <GitMerge className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Connect your git repositories for diagramming, monitoring and syncing.</h2>
        <p className="text-gray-600 mb-4">
          Link your GitLab or GitHub repositories to enable advanced features like automatic syncing, 
          pull request monitoring, and repository visualization.
        </p>
        <Button variant="link" className="px-0">Learn more</Button>
      </div>

      {organizations.length > 0 ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Connected Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizations.map(org => (
                <div key={org.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gitlab-red rounded-md flex items-center justify-center text-white">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{org.name}</h3>
                      <a href={org.url} className="text-sm text-blue-500 hover:underline">{org.url}</a>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        useGitlab().setActiveOrganization(org);
                        setShowTokenDialog(true);
                      }}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeOrg && activeOrg.accessToken && (
            <>
              <GitlabImport />
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Select repositories to add</h2>
                <div className="bg-white border rounded-lg">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Select repositories to add</h3>
                    <p className="text-sm text-gray-500">
                      Below is the list of available repos. Select repos to add to Organizer.
                    </p>
                  </div>
                  <div className="p-4 space-y-3">
                    {mockRepos.map(repo => (
                      <div key={repo.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`repo-${repo.id}`}
                          checked={selectedRepos.includes(repo.name)}
                          onCheckedChange={() => handleToggleRepo(repo.name)}
                        />
                        <Label htmlFor={`repo-${repo.id}`} className="cursor-pointer">
                          {repo.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleAddRepositories}>Save</Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {repositories.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Active Repositories</h2>
              <div className="bg-white border rounded-lg">
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-4">
                    The projects below are authorized in GitLab. Organizer will only interact with projects that are set as active here. 
                    Active projects can be used for diagramming, monitoring, or syncing.
                  </p>
                  {repositories.map(repo => (
                    <div key={repo.id} className="flex items-center justify-between border-b last:border-0 py-3">
                      <div className="flex items-center gap-3">
                        <GitBranch className="w-5 h-5 text-gitlab-orange" />
                        <div>
                          <span>{repo.name}</span>
                          {repo.gitlabProjectId && (
                            <div className="text-xs text-gray-500">ID: {repo.gitlabProjectId}</div>
                          )}
                        </div>
                      </div>
                      <Select
                        defaultValue={repo.isActive ? (repo.isSynced ? "activeAndSynced" : "active") : "inactive"}
                        onValueChange={(value) => {
                          if (value === "activeAndSynced") {
                            updateRepositoryStatus(repo.id, true, true);
                          } else if (value === "active") {
                            updateRepositoryStatus(repo.id, true, false);
                          } else {
                            updateRepositoryStatus(repo.id, false);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activeAndSynced">Active and synced</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">No Git organizations connected yet.</p>
          <Button onClick={() => setShowConnectDialog(true)}>
            Connect Git Organization
          </Button>
        </div>
      )}

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Git Organization</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <div 
                  className="p-4 border rounded-md flex flex-col items-center cursor-pointer hover:border-blue-500"
                  onClick={() => {
                    toast({
                      title: "GitLab Selected",
                      description: "You've selected to connect a GitLab organization",
                    });
                  }}
                >
                  <GitBranch className="w-8 h-8 text-gitlab-orange mb-2" />
                  <span className="text-sm font-medium">GitLab</span>
                  <span className="text-xs text-gray-500">Add a GitLab Organization</span>
                </div>
                <div 
                  className="p-4 border rounded-md flex flex-col items-center cursor-pointer hover:border-blue-500"
                  onClick={() => {
                    toast({
                      title: "GitHub Selected",
                      description: "You've selected to connect a GitHub organization",
                      variant: "default",
                    });
                  }}
                >
                  <Github className="w-8 h-8 text-black mb-2" />
                  <span className="text-sm font-medium">GitHub</span>
                  <span className="text-xs text-gray-500">Add a GitHub Organization</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input 
                  id="name" 
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g., eraserlabs"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">GitLab URL</Label>
                <Input 
                  id="url" 
                  value={organizationUrl}
                  onChange={(e) => setOrganizationUrl(e.target.value)}
                  placeholder="e.g., https://gitlab.com/eraserlabs"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnectOrg}>
              Connect
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Token Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>GitLab Connect</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Get an API access token from <a href="https://gitlab.com/-/profile/personal_access_tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500">GitLab personal access tokens</a> page. The token requires API scope.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="token">Paste API access token</Label>
              <Input 
                id="token" 
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Paste your GitLab API token here" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowTokenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveToken}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GitConnect;
