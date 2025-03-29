import axios from "axios";

const GITLAB_API = "https://gitlab.com/api/v4";

export const makeApiRequest = async (
  token: string,
  endpoint: string,
  method: "GET" | "POST" = "GET",
  data?: any,
  params?: any
) => {
  try {
    const headers = { "PRIVATE-TOKEN": token };
    if (method === "GET") {
      const response = await axios.get(`${GITLAB_API}${endpoint}`, { headers, params });
      return response.data;
    } else if (method === "POST") {
      const response = await axios.post(`${GITLAB_API}${endpoint}`, data, { headers });
      return response.data;
    }
  } catch (error: any) {
    return { error: error.message };
  }
};