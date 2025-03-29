import os
import requests
from flask import Flask, render_template, request, redirect, url_for, flash, session
from dotenv import load_dotenv

# Load environment variables (for API token)
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "development-secret-key")

# GitLab API base URL
GITLAB_API_URL = "https://gitlab.com/api/v4"

def get_gitlab_headers(token):
    """Return headers for GitLab API requests with authorization."""
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

def get_user_info(token):
    """Get current user information from GitLab."""
    response = requests.get(
        f"{GITLAB_API_URL}/user",
        headers=get_gitlab_headers(token)
    )
    if response.status_code == 200:
        return response.json()
    return None

def get_projects(token, page=1, per_page=20):
    """Get projects the user has access to."""
    response = requests.get(
        f"{GITLAB_API_URL}/projects", 
        headers=get_gitlab_headers(token),
        params={'page': page, 'per_page': per_page, 'membership': True}
    )
    if response.status_code == 200:
        return response.json()
    return []

def get_project_details(token, project_id):
    """Get detailed information about a specific project."""
    response = requests.get(
        f"{GITLAB_API_URL}/projects/{project_id}",
        headers=get_gitlab_headers(token)
    )
    if response.status_code == 200:
        return response.json()
    return None

def get_project_files(token, project_id, path="", ref="main"):
    """Get files and directories within a project."""
    response = requests.get(
        f"{GITLAB_API_URL}/projects/{project_id}/repository/tree",
        headers=get_gitlab_headers(token),
        params={'path': path, 'ref': ref}
    )
    if response.status_code == 200:
        return response.json()
    return []

def get_groups(token, page=1, per_page=20):
    """Get groups the user is a member of."""
    response = requests.get(
        f"{GITLAB_API_URL}/groups",
        headers=get_gitlab_headers(token),
        params={'page': page, 'per_page': per_page}
    )
    if response.status_code == 200:
        return response.json()
    return []

def get_group_projects(token, group_id, page=1, per_page=20):
    """Get projects within a specific group."""
    response = requests.get(
        f"{GITLAB_API_URL}/groups/{group_id}/projects",
        headers=get_gitlab_headers(token),
        params={'page': page, 'per_page': per_page}
    )
    if response.status_code == 200:
        return response.json()
    return []

@app.route('/')
def index():
    """Main page - requires authentication."""
    token = session.get('gitlab_token')
    if not token:
        return render_template('login.html')

    user_info = get_user_info(token)
    if not user_info:
        session.pop('gitlab_token', None)
        flash('Authentication failed. Please enter a valid token.')
        return render_template('login.html')

    projects = get_projects(token)
    groups = get_groups(token)
    
    return render_template(
        'dashboard.html',
        user=user_info,
        projects=projects,
        groups=groups
    )

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login with GitLab API token."""
    if request.method == 'POST':
        token = request.form.get('gitlab_token')
        if token:
            # Verify token works
            user_info = get_user_info(token)
            if user_info:
                session['gitlab_token'] = token
                return redirect(url_for('index'))
            else:
                flash('Invalid GitLab API token')
        else:
            flash('Please provide a GitLab API token')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Log out the user by removing the token."""
    session.pop('gitlab_token', None)
    flash('You have been logged out')
    return redirect(url_for('index'))

@app.route('/project/<int:project_id>')
def project_detail(project_id):
    """Show project details."""
    token = session.get('gitlab_token')
    if not token:
        return redirect(url_for('login'))
    
    project = get_project_details(token, project_id)
    files = get_project_files(token, project_id)
    
    if not project:
        flash('Project not found or access denied')
        return redirect(url_for('index'))
        
    return render_template(
        'project_detail.html',
        project=project,
        files=files
    )

@app.route('/group/<int:group_id>')
def group_detail(group_id):
    """Show group details and projects."""
    token = session.get('gitlab_token')
    if not token:
        return redirect(url_for('login'))
    
    projects = get_group_projects(token, group_id)
    
    return render_template(
        'group_detail.html',
        group_id=group_id,
        projects=projects
    )

if __name__ == '__main__':
    app.run(debug=True)