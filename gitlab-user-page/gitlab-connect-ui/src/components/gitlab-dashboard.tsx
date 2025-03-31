"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RepositoryList } from "./repository-list";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface GitLabUser {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  email?: string;
  web_url: string;
}

interface GitLabDashboardProps {
  user: GitLabUser;
  token: string;
  onDisconnect: () => void;
}

export function GitLabDashboard({ user, token, onDisconnect }: GitLabDashboardProps) {
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
  };

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <Card className="p-6 border border-green-200 bg-green-50">
        <div className="flex items-center gap-4 mb-4">
          {user.avatar_url && (
            <img 
              src={user.avatar_url} 
              alt={user.name} 
              className="w-12 h-12 rounded-full border border-gray-200"
            />
          )}
          <div className="flex-1">
            <h3 className="font-medium text-lg">{user.name}</h3>
            <p className="text-gray-600">@{user.username}</p>
            {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
          </div>
          <div>
            <Button 
              variant="outline" 
              className="text-gray-700 border-gray-300"
              onClick={onDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600 mb-4">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
          <Button 
            className="mt-2 bg-red-100 text-red-800 hover:bg-red-200 border-0"
            onClick={() => setError(null)}
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      )}

      <Tabs defaultValue="repositories" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="merge-requests">Merge Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="repositories" className="mt-0">
          <RepositoryList token={token} onError={handleError} />
        </TabsContent>
        
        <TabsContent value="issues" className="mt-0">
          <div className="p-8 text-center text-gray-500">
            <p>Issues functionality coming soon</p>
            <Button 
              variant="link" 
              onClick={() => window.open(`https://gitlab.com/dashboard/issues`, "_blank")}
              className="mt-2"
            >
              View Issues on GitLab
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="merge-requests" className="mt-0">
          <div className="p-8 text-center text-gray-500">
            <p>Merge Requests functionality coming soon</p>
            <Button 
              variant="link" 
              onClick={() => window.open(`https://gitlab.com/dashboard/merge_requests`, "_blank")}
              className="mt-2"
            >
              View Merge Requests on GitLab
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
