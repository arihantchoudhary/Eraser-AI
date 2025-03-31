"use client";

import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GitBranch, ExternalLink, Trash2 } from "lucide-react";

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

export function ImportedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem("imported_projects");
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(Array.isArray(parsedProjects) ? parsedProjects : []);
      } catch (error) {
        console.error("Error parsing stored projects:", error);
        setProjects([]);
      }
    }
  }, []);

  const handleRemoveProject = (projectId: number) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("imported_projects", JSON.stringify(updatedProjects));
  };

  const handleOpenProject = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filteredProjects = projects.filter(project =>
    project.path_with_namespace.toLowerCase().includes(search.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-3">Imported GitLab Projects</h2>
        <p className="text-gray-600 mb-4">
          View and manage your imported GitLab repositories.
        </p>
      </div>

      {projects.length > 0 ? (
        <>
          <Input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />

          {filteredProjects.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No projects match your search
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {filteredProjects.map(project => (
                <Card key={project.id} className="p-4 bg-white hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <GitBranch size={18} className="text-blue-600" />
                        <h3 className="font-medium">{project.path_with_namespace}</h3>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenProject(project.web_url)}
                        className="text-gray-700"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Open in GitLab
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveProject(project.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-gray-600 text-sm">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} displayed
          </div>
        </>
      ) : (
        <div className="py-12 text-center">
          <div className="text-gray-500 mb-4">No GitLab projects have been imported yet.</div>
          <Button 
            onClick={() => window.location.href = "/"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Connect to GitLab
          </Button>
        </div>
      )}
    </div>
  );
}
