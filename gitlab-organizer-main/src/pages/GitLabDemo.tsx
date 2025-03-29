import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/Layout";

const PUBLIC_PROJECT_ID = 68479344;
const PRIVATE_PROJECT_ID = 68412685;
const GITLAB_API = "https://gitlab.com/api/v4";

const GitLabDemo = () => {
  const [token, setToken] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("public-project");

  async function makeApiRequest(
    endpoint: string,
    method = "GET",
    data?: any
  ) {
    try {
      const res = await fetch(`${GITLAB_API}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: method === "POST" && data ? JSON.stringify(data) : undefined,
      });
      const json = await res.json();
      return json;
    } catch (error: any) {
      return { error: error.message };
    }
  }

  const handleGetPublicProject = async () => {
    const resp = await makeApiRequest(`/projects/${PUBLIC_PROJECT_ID}`);
    setResponse(resp);
  };

  const handleGetPrivateProject = async () => {
    const resp = await makeApiRequest(`/projects/${PRIVATE_PROJECT_ID}`);
    setResponse(resp);
  };

  const handleListGroups = async () => {
    const resp = await makeApiRequest("/groups");
    setResponse(resp);
  };

  const handleListIssues = async (projectId: number) => {
    const resp = await makeApiRequest(`/projects/${projectId}/issues`);
    setResponse(resp);
  };

  const handleCreateIssue = async (projectId: number, title: string, description: string) => {
    const data = { title, description };
    const resp = await makeApiRequest(`/projects/${projectId}/issues`, "POST", data);
    setResponse(resp);
  };

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">GitLab Integration Demo</h1>
        <p>
          This demo page allows you to experiment with GitLab API endpoints.
          Provide your GitLab Personal Access Token below and select a test case.
        </p>
        {/* Token input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">GitLab Personal Access Token</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter token here"
            className="w-full rounded border p-2"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="public-project">Public Project</TabsTrigger>
            <TabsTrigger value="private-project">Private Project</TabsTrigger>
            <TabsTrigger value="groups">List Groups</TabsTrigger>
            <TabsTrigger value="issues">List Issues</TabsTrigger>
            <TabsTrigger value="create-issue">Create Issue</TabsTrigger>
          </TabsList>
          <TabsContent value="public-project">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Read Public Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleGetPublicProject}>Execute Request</Button>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="private-project">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Read Private Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleGetPrivateProject}>Execute Request</Button>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="groups">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>List GitLab Groups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleListGroups}>Execute Request</Button>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="issues">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>List Issues for a Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => handleListIssues(PUBLIC_PROJECT_ID)}>
                  Execute Request (Public Project)
                </Button>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="create-issue">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Create a New Issue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => handleCreateIssue(PUBLIC_PROJECT_ID, "Test Issue", "This is a demo issue created via the GitLab Demo page.")}>
                  Create Issue (Public Project)
                </Button>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GitLabDemo;
