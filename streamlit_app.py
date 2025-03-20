import streamlit as st
import validators
from app import get_repo_structure, generate_prompt_from_repo_structure, generate_diagram_from_eraser

# Page configuration
st.set_page_config(
    page_title="GitHub Repository Visualizer",
    page_icon="🔍",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        padding: 2rem;
    }
    .stButton > button {
        width: 100%;
        background-color: #0366d6;
        color: white;
    }
    .stButton > button:hover {
        background-color: #024ea4;
        color: white;
    }
    .error-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #ffebee;
        color: #c62828;
    }
    .success-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #e8f5e9;
        color: #2e7d32;
    }
</style>
""", unsafe_allow_html=True)

# Title and description
st.title("🔍 GitHub Repository Visualizer")
st.markdown("""
Generate architecture diagrams from GitHub repositories using AI.
Simply paste a public GitHub repository URL and get a visual representation of its structure.
""")

# Input form
with st.form("repo_form"):
    repo_url = st.text_input(
        "GitHub Repository URL",
        placeholder="https://github.com/username/repository",
        help="Enter the full URL of a public GitHub repository"
    )
    
    generate_button = st.form_submit_button("Generate Diagram")

if generate_button and repo_url:
    if not validators.url(repo_url):
        st.error("Please enter a valid URL")
    else:
        try:
            # Extract repository name from URL
            repo_parts = repo_url.strip("/").split("/")
            if len(repo_parts) >= 5 and repo_parts[2] == "github.com":
                repo_name = f"{repo_parts[-2]}/{repo_parts[-1]}"
                
                with st.spinner("🔍 Analyzing repository structure..."):
                    repo_structure = get_repo_structure(repo_name)
                
                with st.spinner("🤖 Generating diagram prompt..."):
                    prompt = generate_prompt_from_repo_structure(repo_structure)
                
                with st.spinner("🎨 Creating diagram..."):
                    diagram = generate_diagram_from_eraser(prompt)
                
                if "error" in diagram:
                    st.error(f"Error generating diagram: {diagram['error']}")
                else:
                    st.success("✨ Diagram generated successfully!")
                    
                    # Display repository structure
                    with st.expander("📁 Repository Structure"):
                        st.write(repo_structure)
                    
                    # Display generated prompt
                    with st.expander("🤖 Generated Prompt"):
                        st.write(prompt)
                    
                    # Display diagram
                    if "diagram_url" in diagram:
                        st.subheader("📊 Generated Diagram")
                        st.image(diagram["diagram_url"], use_column_width=True)
                    else:
                        st.json(diagram)
            else:
                st.error("Invalid GitHub repository URL format")
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
else:
    # Show example
    st.info("""
    ### Example
    Try with a public repository URL like:
    ```
    https://github.com/arihantchoudhary/team-epal
    ```
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center">
    Made with ❤️ using Streamlit, GitHub API, and Eraser AI
</div>
""", unsafe_allow_html=True) 