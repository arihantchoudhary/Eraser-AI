
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GitBranch } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-gitlab-red rounded-lg flex items-center justify-center shadow-lg">
            <GitBranch className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">GitLab Repository Organizer</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect, manage, and organize your GitLab repositories in one place. Monitor pull requests, track changes, and sync repositories with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/git-connect')}>
            Connect GitLab Organizations
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.open('https://gitlab.com', '_blank')}>
            Visit GitLab
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
