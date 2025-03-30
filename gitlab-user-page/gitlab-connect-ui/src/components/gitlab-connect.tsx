"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GitLabConnect() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-medium mb-4">GitLab Connect</h2>

      <p className="mb-6 text-gray-700 text-sm">
        Get an API access token from{" "}
        <a href="#" className="text-blue-500 hover:underline">
          user settings
        </a>
        , group settings, or project settings. The token requires API scope.
      </p>

      <div className="mb-6">
        <Input
          placeholder="Paste API access token"
          className="w-full mb-4 h-10 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Save
        </Button>
      </div>
    </div>
  );
}
