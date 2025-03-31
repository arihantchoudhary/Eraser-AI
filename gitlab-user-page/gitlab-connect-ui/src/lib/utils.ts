/**
 * Utility function to conditionally join class names.
 *
 * @param classes - Array of classes, can include falsy values.
 * @returns A single string with truthy classes concatenated with a space.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Makes a request to the GitLab API using the provided personal access token.
 *
 * @param endpoint - The GitLab API endpoint (e.g., "/projects/{id}").
 * @param token - The personal access token provided by the user.
 * @param method - HTTP method to use, defaults to "GET".
 * @param data - Data to be sent with a POST request.
 * @param params - URL parameters for GET requests.
 * @returns A promise that resolves to the response JSON or an error object.
 */
export async function callGitLabAPI(
  endpoint: string,
  token: string,
  method: 'GET' | 'POST' = 'GET',
  data?: any,
  params?: Record<string, string>
): Promise<any> {
  const GITLAB_API = "https://gitlab.com/api/v4";
  
  // Build URL and add URL search parameters if provided
  const url = new URL(`${GITLAB_API}${endpoint}`);
  if (method === "GET" && params) {
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
  }
  
  const options: RequestInit = {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
  
  if (method === "POST" && data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url.toString(), options);
    if (response.ok) {
      return await response.json();
    } else {
      return {
        error: `API returned status code ${response.status}`,
        details: await response.text()
      };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}
