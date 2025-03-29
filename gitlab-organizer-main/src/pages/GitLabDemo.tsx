import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { makeApiRequest } from "@/api/gitlabApi";

const GitLabDemo = () => {
  // Input fields for custom values; default values provided.
  const [token, setToken] = useState("glpat-EcsmmJ_ZQxFBxCDdwVFA");
  const [publicProjectId, setPublicProjectId] = useState("68479344");
  const [privateProjectId, setPrivateProjectId] = useState("68412685");
  const [groupId, setGroupId] = useState("");
  const [issueProjectId, setIssueProjectId] = useState("68479344");
  const [commitSha, setCommitSha] = useState("");
  const [issueTitle, setIssueTitle] = useState("Test Issue");
  const [issueDescription, setIssueDescription] = useState("This is a test issue.");

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Handler to execute an API test case.
  const handleTest = async (endpoint: string, method: "GET" | "POST" = "GET", data?: any) => {
    setLoading(true);
    const result = await makeApiRequest(token, endpoint, method, data);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Custom credentials and IDs input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">GitLab API Test Cases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">GitLab Token:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Public Project ID:</label>
            <input
              type="text"
              value={publicProjectId}
              onChange={(e) => setPublicProjectId(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Private Project ID:</label>
            <input
              type="text"
              value={privateProjectId}
              onChange={(e) => setPrivateProjectId(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Group ID (for listing projects):</label>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Group ID"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Issue Project ID (for issues, merge requests, commits):</label>
            <input
              type="text"
              value={issueProjectId}
              onChange={(e) => setIssueProjectId(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Commit SHA (for commit details):</label>
            <input
              type="text"
              value={commitSha}
              onChange={(e) => setCommitSha(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Commit SHA"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Issue Title:</label>
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Issue Description:</label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Display all test cases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Test Case Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside text-sm">
            <li>
              <strong>Read Public Project (HTTPie &amp; cURL):</strong> GET <code>https://gitlab.com/api/v4/projects/{publicProjectId}</code>
            </li>
            <li>
              <strong>Read Private Project (HTTPie &amp; cURL):</strong> GET <code>https://gitlab.com/api/v4/projects/{privateProjectId}</code>
            </li>
            <li>
              <strong>List GitLab Groups (HTTPie &amp; cURL):</strong> GET <code>https://gitlab.com/api/v4/groups</code>
            </li>
            <li>
              <strong>List Projects from a Group (HTTPie &amp; cURL):</strong> GET <code>https://gitlab.com/api/v4/groups/<GROUP_ID>/projects</code>
            </li>
            <li>
              <strong>List Issues for a Project (HTTPie &amp; cURL):</strong> GET <code>https://gitlab.com/api/v4/projects/<PROJECT_ID>/issues</code>
            </li>
            <li>
              <strong>Create a New Issue (HTTPie &amp; cURL):</strong> POST <code>https://gitlab.com/api/v4/projects/<PROJECT_ID>/issues</code> with title and description
            </li>
            <li>
              <strong>List Merge Requests (HTTPie &amp; cURL):</strong> GET <code>https://gitlab.com/api/v4/projects/<PROJECT_ID>/merge_requests</code>
            </li>
            <li>
              <strong>Get Commit Details (HTTPie &amp; cURL):</strong> GET <code>https://gitlab.com/api/v4/projects/<PROJECT_ID>/repository/commits/<COMMIT_SHA></code>
            </li>
            <li>
              <strong>Fetch Pipelines:</strong> GET <code>https://gitlab.com/api/v4/projects/{publicProjectId}/pipelines</code>
            </li>
            <li>
              <strong>Fetch Test Reports:</strong> GET <code>https://gitlab.com/api/v4/projects/{publicProjectId}/test_reports</code>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Ten Test Case Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Execute Test Cases</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Button onClick={() => handleTest(`/projects/${publicProjectId}`)} disabled={loading}>
            Read Public Project
          </Button>
          <Button onClick={() => handleTest(`/projects/${privateProjectId}`)} disabled={loading}>
            Read Private Project
          </Button>
          <Button onClick={() => handleTest(`/groups`)} disabled={loading}>
            List GitLab Groups
          </Button>
          <Button
            onClick={() => {
              if (groupId) {
                handleTest(`/groups/${groupId}/projects`);
              } else {
                alert("Please enter a Group ID.");
              }
            }}
            disabled={loading}
          >
            List Projects from Group
          </Button>
          <Button onClick={() => handleTest(`/projects/${issueProjectId}/issues`)} disabled={loading}>
            List Issues for Project
          </Button>
          <Button
            onClick={() =>
              handleTest(`/projects/${issueProjectId}/issues`, "POST", { title: issueTitle, description: issueDescription })
            }
            disabled={loading}
          >
            Create New Issue
          </Button>
          <Button onClick={() => handleTest(`/projects/${issueProjectId}/merge_requests`)} disabled={loading}>
            List Merge Requests
          </Button>
          <Button
            onClick={() => {
              if (commitSha) {
                handleTest(`/projects/${issueProjectId}/repository/commits/${commitSha}`);
              } else {
                alert("Please enter a Commit SHA.");
              }
            }}
            disabled={loading}
          >
            Get Commit Details
          </Button>
          <Button onClick={() => handleTest(`/projects/${publicProjectId}/pipelines`)} disabled={loading}>
            Fetch Pipelines
          </Button>
          <Button onClick={() => handleTest(`/projects/${publicProjectId}/test_reports`)} disabled={loading}>
            Fetch Test Reports
          </Button>
        </CardContent>
      </Card>

      {/* API Response Display */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GitLabDemo;
