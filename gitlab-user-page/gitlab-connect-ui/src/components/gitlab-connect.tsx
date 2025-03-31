"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ProjectSelection } from "./project-selection";

interface GitLabConnectProps {
  initialToken?: string;
}

interface GitLabUser {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  email?: string;
  web_url: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  web_url: string;
  namespace: {
    name: string;
  };
  path_with_namespace: string;
}

export function GitLabConnect({ initialToken = "" }: GitLabConnectProps) {
  const [token, setToken] = useState(initialToken || "");
  const [savedToken, setSavedToken] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<GitLabUser | null>(null);
  const [importedProjects, setImportedProjects] = useState<Project[]>([]);
  const [projectsImported, setProjectsImported] = useState(false);

  useEffect(() => {
    // Check for stored token in localStorage
    const storedToken = localStorage.getItem("gitlab_token");
    if (storedToken) {
      setToken(storedToken);
      setSavedToken(storedToken);
      validateToken(storedToken);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    if (!tokenToValidate.trim()) {
      setMessage("Please enter a valid token");
      setIsError(true);
      setIsConnected(false);
      setUser(null);
      return false;
    }

    setIsLoading(true);
    setMessage("Validating token...");
    setIsError(false);

    try {
      const response = await fetch("/api/call-gitlab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenToValidate,
          endpoint: "/user",
          method: "GET",
        }),
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        setMessage(`Connection failed: ${data.error || 'Invalid token'}. Please check your token and try again.`);
        setIsError(true);
        setIsConnected(false);
        setUser(null);
        return false;
      }

      setUser(data);
      setMessage("Connected successfully to GitLab!");
      setIsConnected(true);
      localStorage.setItem("gitlab_token", tokenToValidate);
      return true;
    } catch (error) {
      setMessage(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
      setIsError(true);
      setIsConnected(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const isValid = await validateToken(token);
    if (isValid) {
      setSavedToken(token);
    }
  };

  const handleCancel = () => {
    setToken(savedToken);
    setMessage(savedToken ? "Changes cancelled." : "");
    setIsError(false);
  };

  const handleDisconnect = () => {
    setToken("");
    setSavedToken("");
    setUser(null);
    setIsConnected(false);
    setProjectsImported(false);
    setImportedProjects([]);
    setMessage("Disconnected from GitLab.");
    localStorage.removeItem("gitlab_token");
  };

  const handleError = (errorMessage: string) => {
    setMessage(errorMessage);
    setIsError(true);
  };

  const handleImportComplete = (projects: Project[]) => {
    setImportedProjects(projects);
    setProjectsImported(true);
    
    // Here you would typically save this information to your backend
    // For now, we just store it in localStorage as an example
    localStorage.setItem("imported_projects", JSON.stringify(projects));
  };

  // If projects have been imported, show success view
  if (isConnected && projectsImported) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">GitLab Connect</h2>
          <p className="text-gray-600 mb-4">
            Projects have been successfully imported!
          </p>
        </div>

        <Card className="p-6 border border-green-200 bg-green-50">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-2">Import Complete</h3>
              <p className="text-gray-700 mb-4">
                You have successfully imported {importedProjects.length} projects from GitLab.
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {importedProjects.map(project => (
                  <li key={project.id} className="text-gray-700">
                    {project.path_with_namespace}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={() => window.location.href = "/imported-projects"}
            >
              View Imported Projects
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={() => setProjectsImported(false)}
            >
              Import More Projects
            </Button>
            <Button 
              variant="outline" 
              className="text-gray-700 border-gray-300"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If connected, show the project selection
  if (isConnected && user && savedToken) {
    return (
      <ProjectSelection 
        token={savedToken} 
        onError={handleError}
        onImportComplete={handleImportComplete}
      />
    );
  }

  // Otherwise, show the connection form
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-3">GitLab Connect</h2>
        <p className="text-gray-600 mb-4">
          Connect to GitLab to access repositories, issues, and other GitLab resources.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Get an API access token from <a href="https://gitlab.com/-/user_settings/personal_access_tokens" target="_blank" className="text-blue-600 hover:underline">GitLab personal access tokens</a>. 
          The token requires <span className="font-medium">api</span> and <span className="font-medium">read_user</span> scopes.
        </p>
        <Input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full mb-3"
          placeholder="Enter your GitLab API token (e.g., glpat-xxxxxxxxxxxx)"
          disabled={isLoading}
        />
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            disabled={isLoading}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Connecting..." : "Connect to GitLab"}
          </Button>
        </div>
      </div>
      
      {message && !isConnected && (
        <p className={`mt-3 text-sm ${isError ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
