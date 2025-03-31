import { callGitLabAPI } from '../../../lib/utils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, endpoint, method, data, params } = body;
    
    if (!token || !endpoint) {
      return NextResponse.json(
        { error: "Missing required parameters: token and endpoint are required." },
        { status: 400 }
      );
    }
    
    const apiMethod = method || "GET";
    const result = await callGitLabAPI(endpoint, token, apiMethod, data, params);
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}