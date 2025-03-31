"use client";

import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Repository {
  id: number;
  name: string;
  description: string;
  web_url: string;
  star_count: number;
  fork_count: number;
  last_activity_at: string;
  namespace: {
    name: string;
  };
}

interface RepositoryListProps {
  token: string;
  onError?: (message: string) => void;
}

export function RepositoryList({ token, onError }: RepositoryListProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (token) {
      fetchRepositories();
    }
  }, [token, page]);

  const fetchRepositories = async () => {
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
            per_page: "10",
            page: page.toString(),
            order_by: "last_activity_at",
            sort: "desc",
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        onError?.(data.error);
        return;
      }

      if (Array.isArray(data)) {
        if (page === 1) {
          setRepositories(data);
        } else {
          setRepositories(prev => [...prev, ...data]);
        }
        
        setHasMore(data.length === 10); // If we get fewer than 10 items, we've reached the end
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setRepositories([]);
    fetchRepositories();
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(search.toLowerCase())) ||
    repo.namespace.name.toLowerCase().includes(search.toLowerCase())
  );

  // Format date to be human-readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Repositories</h2>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={isLoading}
          className="text-sm"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Input
        type="text"
        placeholder="Search repositories..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />

      {filteredRepositories.length === 0 && !isLoading ? (
        <div className="text-center py-10 text-gray-500">
          {search ? "No repositories match your search" : "No repositories found"}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRepositories.map(repo => (
            <Card key={repo.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg hover:text-blue-600">
                    <a href={repo.web_url} target="_blank" rel="noopener noreferrer">
                      {repo.namespace.name}/{repo.name}
                    </a>
                  </h3>
                  {repo.description && (
                    <p className="text-gray-600 mt-1 line-clamp-2">{repo.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-3 gap-4">
                <span>
                  ⭐ {repo.star_count} {repo.star_count === 1 ? "star" : "stars"}
                </span>
                <span>
                  🍴 {repo.fork_count} {repo.fork_count === 1 ? "fork" : "forks"}
                </span>
                <span>Updated {formatDate(repo.last_activity_at)}</span>
              </div>
            </Card>
          ))}

          {hasMore && (
            <div className="text-center pt-4">
              <Button 
                onClick={handleLoadMore} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
