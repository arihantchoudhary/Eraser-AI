import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGitlab } from '@/contexts/GitlabContext';
import { X } from 'lucide-react';

interface GitLabSettingsProps {
  onClose: () => void;
}

const GitLabSettings: React.FC<GitLabSettingsProps> = ({ onClose }) => {
  const { activeOrg, saveAccessToken } = useGitlab();
  const [apiToken, setApiToken] = useState(activeOrg?.accessToken || '');

  const handleSave = async () => {
    if (activeOrg && apiToken) {
      await saveAccessToken(activeOrg.id, apiToken);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">GitLab Connect</h2>
            
            <div className="bg-white border rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-4">
                Get an API access token from <a href="https://gitlab.com/-/profile/personal_access_tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">user settings</a>, group settings, or project settings. The token requires API scope.
              </p>
              
              <div className="mb-6">
                <Label htmlFor="apiToken" className="mb-2 block">Paste API access token</Label>
                <Input
                  id="apiToken"
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className="w-full"
                  placeholder="Paste API access token"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitLabSettings;
