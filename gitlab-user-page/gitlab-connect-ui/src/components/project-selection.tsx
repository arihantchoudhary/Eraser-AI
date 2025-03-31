"use client";

import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

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

interface ProjectSelectionProps {
  token: string;
  onError?: (message: string) => void;
  onImportComplete?: (selectedProjects: Project[]) => void;
}

export function ProjectSelection({ token, onError, onImportComplete }: ProjectSelectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  const fetchProjects = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/call-gitlab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          endpoint: "/projects",
          method: "GET",
          params: {
            membership: "true",
            per_page: "100",
            order_by: "path",
            sort: "asc",
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        onError?.(data.error);
        return;
      }

      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (projectId: number) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(project => project.id));
    }
  };

  const handleImportProjects = async () => {
    if (selectedProjects.length === 0) {
      setMessage("Please select at least one project to import");
      return;
    }

    setImporting(true);
    setMessage("Importing selected projects...");

    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get the selected project objects
      const projectsToImport = projects.filter(project => 
        selectedProjects.includes(project.id)
      );

      // Here we would normally handle the actual import
      // For now, we just pass the selected projects to the callback
      if (onImportComplete) {
        onImportComplete(projectsToImport);
      }

      setMessage(`Successfully imported ${selectedProjects.length} projects`);
    } catch (error) {
      setMessage(`Error importing projects: ${error instanceof Error ? error.message : String(error)}`);
      onError?.(error instanceof Error ? error.message : String(error));
    } finally {
      setImporting(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.path_with_namespace.toLowerCase().includes(search.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(search.toLowerCase()))
  );

  const allSelected = filteredProjects.length > 0 && 
    filteredProjects.every(project => selectedProjects.includes(project.id));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-3">GitLab Connect</h2>
        <p className="text-gray-600 mb-4">
          Below is the list of available projects. Select repos to add to Eraser.
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
          disabled={isLoading}
        />
        <div className="flex items-center gap-2">
          <Checkbox 
            id="select-all" 
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            disabled={isLoading || projects.length === 0}
          />
          <label htmlFor="select-all" className="text-sm cursor-pointer">
            {allSelected ? "Deselect all" : "Select all"}
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {search ? "No projects match your search" : "No projects found"}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProjects.map(project => (
            <Card key={project.id} className="p-3 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id={`project-${project.id}`}
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={() => handleSelectProject(project.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`project-${project.id}`} 
                    className="block font-medium cursor-pointer"
                  >
                    {project.path_with_namespace}
                  </label>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center py-4 mt-4 border-t">
        <span className="text-sm text-gray-600">
          {selectedProjects.length} of {filteredProjects.length} projects selected
        </span>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setSelectedProjects([])}
            disabled={selectedProjects.length === 0 || importing}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImportProjects}
            disabled={selectedProjects.length === 0 || importing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {importing ? "Importing..." : "Import Selected Projects"}
          </Button>
        </div>
      </div>

      {message && (
        <p className="text-center text-sm mt-4 text-blue-600">
          {message}
        </p>
      )}
    </div>
  );
}
