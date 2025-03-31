"use client";

import React, { useState } from "react";

interface GitLabConnectProps {
  initialToken?: string;
}

export function GitLabConnect({ initialToken = "" }: GitLabConnectProps) {
  const [token, setToken] = useState(initialToken || "glpat-EcsmmJ_ZQxFBxCDdwVFA");
  const [savedToken, setSavedToken] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    // Save token logic, e.g., call an API to validate token
    // For now just simulate saving.
    setSavedToken(token);
    setMessage("Token saved successfully.");
  };

  const handleCancel = () => {
    // Reset token to the previously saved token
    setToken(savedToken);
    setMessage("Changes cancelled.");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">GitLab Connect</h2>
      <p className="mb-2">
        Get an API access token from user settings, group settings, or project settings. The token requires API scope.
      </p>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="border rounded p-2 w-full mb-3"
        placeholder="Enter your GitLab API token"
      />
      <div className="flex gap-2">
        <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">
          Cancel
        </button>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
    </div>
  );
}
