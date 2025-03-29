import streamlit as st
import requests
import json
import pandas as pd
import time

st.set_page_config(page_title="GitLab API Explorer", layout="wide")

# Hardcoded credentials (in production, use environment variables or secure storage)
GITLAB_TOKEN = "glpat-EcsmmJ_ZQxFBxCDdwVFA"
PUBLIC_PROJECT_ID = 68479344
PRIVATE_PROJECT_ID = 68412685

# API Settings
GITLAB_API = "https://gitlab.com/api/v4"
HEADERS = {"Authorization": f"Bearer {GITLAB_TOKEN}"}

def make_api_request(endpoint, method="GET", data=None, params=None):
    """Make a request to the GitLab API and return the response"""
    url = f"{GITLAB_API}{endpoint}"
    
    with st.spinner(f"Making {method} request to {url}"):
        try:
            if method == "GET":
                response = requests.get(url, headers=HEADERS, params=params)
            elif method == "POST":
                response = requests.post(url, headers=HEADERS, json=data)
            else:
                return {"error": f"Method {method} not supported"}
            
            if response.status_code >= 200 and response.status_code < 300:
                return response.json()
            else:
                return {
                    "error": f"API returned status code {response.status_code}",
                    "details": response.text
                }
        except Exception as e:
            return {"error": str(e)}

def display_response(response):
    """Display API response in a formatted way"""
    if isinstance(response, dict) and "error" in response:
        st.error(f"Error: {response['error']}")
        if "details" in response:
            with st.expander("Error Details"):
                st.code(response["details"])
    else:
        with st.expander("Response Details", expanded=True):
            st.json(response)

# App UI
st.title("GitLab API Explorer")
st.write("This app demonstrates connecting to GitLab API with a personal access token.")

# Sidebar with test cases
st.sidebar.title("Test Cases")
test_case = st.sidebar.radio(
    "Select a test case:",
    [
        "Read Public Project",
        "Read Private Project", 
        "List GitLab Groups",
        "List Projects from a Group",
        "List Issues for a Project",
        "Create a New Issue",
        "List Merge Requests",
        "Get Commit Details"
    ]
)

# Token status indicator
token_status_container = st.sidebar.container()
if GITLAB_TOKEN:
    token_status_container.success("✅ Token configured")
else:
    token_status_container.error("❌ No token configured")

st.sidebar.markdown("---")
st.sidebar.write("Public Project ID:", PUBLIC_PROJECT_ID)
st.sidebar.write("Private Project ID:", PRIVATE_PROJECT_ID)

# Group ID input for tests that need it
group_id = None
if test_case == "List Projects from a Group":
    group_id = st.sidebar.text_input("Group ID", value="")

# Commit SHA input for commit details
commit_sha = None
if test_case == "Get Commit Details":
    commit_sha = st.sidebar.text_input("Commit SHA", value="")

# Main content area
if test_case == "Read Public Project":
    st.header("Read Public Project")
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("cURL Command")
        st.code(f'curl --header "PRIVATE-TOKEN: {GITLAB_TOKEN}" "{GITLAB_API}/projects/{PUBLIC_PROJECT_ID}"')
    
    with col2:
        st.subheader("HTTPie Command")
        st.code(f'http GET {GITLAB_API}/projects/{PUBLIC_PROJECT_ID} "PRIVATE-TOKEN:{GITLAB_TOKEN}"')
    
    if st.button("Execute Request"):
        response = make_api_request(f"/projects/{PUBLIC_PROJECT_ID}")
        display_response(response)

elif test_case == "Read Private Project":
    st.header("Read Private Project")
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("cURL Command")
        st.code(f'curl --header "PRIVATE-TOKEN: {GITLAB_TOKEN}" "{GITLAB_API}/projects/{PRIVATE_PROJECT_ID}"')
    
    with col2:
        st.subheader("HTTPie Command")
        st.code(f'http GET {GITLAB_API}/projects/{PRIVATE_PROJECT_ID} "PRIVATE-TOKEN:{GITLAB_TOKEN}"')
    
    if st.button("Execute Request"):
        response = make_api_request(f"/projects/{PRIVATE_PROJECT_ID}")
        display_response(response)

elif test_case == "List GitLab Groups":
    st.header("List GitLab Groups")
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("cURL Command")
        st.code(f'curl --header "PRIVATE-TOKEN: {GITLAB_TOKEN}" "{GITLAB_API}/groups"')
    
    with col2:
        st.subheader("HTTPie Command")
        st.code(f'http GET {GITLAB_API}/groups "PRIVATE-TOKEN:{GITLAB_TOKEN}"')
    
    if st.button("Execute Request"):
        response = make_api_request("/groups")
        display_response(response)

elif test_case == "List Projects from a Group":
    st.header("List Projects from a Group")
    
    if not group_id:
        st.warning("Please enter a Group ID in the sidebar")
    else:
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("cURL Command")
            st.code(f'curl --header "PRIVATE-TOKEN: {GITLAB_TOKEN}" "{GITLAB_API}/groups/{group_id}/projects"')
        
        with col2:
            st.subheader("HTTPie Command")
            st.code(f'http GET {GITLAB_API}/groups/{group_id}/projects "PRIVATE-TOKEN:{GITLAB_TOKEN}"')
        
        if st.button("Execute Request"):
            response = make_api_request(f"/groups/{group_id}/projects")
            display_response(response)

elif test_case == "List Issues for a Project":
    st.header("List Issues for a Project")
    
    project_id = st.selectbox("Select Project", [PUBLIC_PROJECT_ID, PRIVATE_PROJECT_ID])
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("cURL Command")
        st.code(f'curl --header "PRIVATE-TOKEN: {GITLAB_TOKEN}" "{GITLAB_API}/projects/{project_id}/issues"')
    
    with col2:
        st.subheader("HTTPie Command")
        st.code(f'http GET {GITLAB_API}/projects/{project_id}/issues "PRIVATE-TOKEN:{GITLAB_TOKEN}"')
    
    if st.button("Execute Request"):
        response = make_api_request(f"/projects/{project_id}/issues")
        display_response(response)

elif test_case == "Create a New Issue":
    st.header("Create a New Issue")
    
    project_id = st.selectbox("Select Project", [PUBLIC_PROJECT_ID, PRIVATE_PROJECT_ID])
    title = st.text_input("Issue Title", "Test Issue")
    description = st.text_area("Issue Description", "This is a test issue created via the Streamlit GitLab API Explorer.")
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("cURL Command")
        st.code(f'''curl --request POST --header "PRIVATE-TOKEN: {GITLAB_TOKEN}" \\
--header "Content-Type: application/json" \\
--data '{{"title": "{title}", "description": "{description}"}}' \\
"{GITLAB_API}/projects/{project_id}/issues"''')
    
    with col2:
        st.subheader("HTTPie Command")
        st.code(f'''http POST {GITLAB_API}/projects/{project_id}/issues \\
"PRIVATE-TOKEN:{GITLAB_TOKEN}" \\
title="{title}" \\
description="{description}"''')
    
    if st.button("Create Issue"):
        data = {
            "title": title,
            "description": description
        }
        response = make_api_request(f"/projects/{project_id}/issues", method="POST", data=data)
        display_response(response)

elif test_case == "List Merge Requests":
    st.header("List Merge Requests")
    
    project_id = st.selectbox("Select Project", [PUBLIC_PROJECT_ID, PRIVATE_PROJECT_ID])
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("cURL Command")
        st.code(f'curl --header "PRIVATE-TOKEN: {GITLAB_TOKEN}" "{GITLAB_API}/projects/{project_id}/merge_requests"')
    
    with col2:
        st.subheader("HTTPie Command")
        st.code(f'http GET {GITLAB_API}/projects/{project_id}/merge_requests "PRIVATE-TOKEN:{GITLAB_TOKEN}"')
    
    if st.button("Execute Request"):
        response = make_api_request(f"/projects/{project_id}/merge_requests")
        display_response(response)

elif test_case == "Get Commit Details":
    st.header("Get Commit Details")
    
    project_id = st.selectbox("Select Project", [PUBLIC_PROJECT_ID, PRIVATE_PROJECT_ID])
    
    if not commit_sha:
        st.info("First, let's find a commit SHA to use")
        
        if st.button("List Recent Commits"):
            response = make_api_request(f"/projects/{project_id}/repository/commits")
            if "error" not in response and len(response) > 0:
                commits_df = pd.DataFrame([
                    {
                        "SHA": commit["id"],
                        "Short SHA": commit["short_id"],
                        "Author": commit["author_name"],
                        "Message": commit["message"],
                        "Date": commit["created_at"]
                    }
                    for commit in response
                ])
                st.dataframe(commits_df)
            else:
                display_response(response)
    else:
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("cURL Command")
            st.code(f'curl --header "PRIVATE-TOKEN: {GITLAB_TOKEN}" "{GITLAB_API}/projects/{project_id}/repository/commits/{commit_sha}"')
        
        with col2:
            st.subheader("HTTPie Command")
            st.code(f'http GET {GITLAB_API}/projects/{project_id}/repository/commits/{commit_sha} "PRIVATE-TOKEN:{GITLAB_TOKEN}"')
        
        if st.button("Execute Request"):
            response = make_api_request(f"/projects/{project_id}/repository/commits/{commit_sha}")
            display_response(response)

# Additional features in the sidebar
st.sidebar.markdown("---")
if st.sidebar.checkbox("Show token in plaintext"):
    st.sidebar.text_input("GitLab Personal Access Token", value=GITLAB_TOKEN, disabled=True)
else:
    st.sidebar.text_input("GitLab Personal Access Token", value="•" * 10, disabled=True)

st.sidebar.markdown("---")
st.sidebar.info(
    "This app demonstrates how to interact with GitLab's API using a personal access token. "
    "In a production environment, you should use more secure authentication methods "
    "and never hardcode tokens."
)													
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									
																									