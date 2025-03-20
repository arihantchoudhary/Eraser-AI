## **Technical Problem Statement: AI-Powered Diagram Generation Using Eraser API**  

### **Objective**  
Design and implement an AI agent workflow that integrates the **Eraser API** with an AI-driven system (e.g., LLMs, automation workflows) to generate meaningful visual diagrams from structured or unstructured input data. The goal is to build a functional proof-of-concept within 35 minutes, demonstrating the core capabilities of the integration.

---

### **Problem Scope**  
The challenge is to create an automated system that takes an input source (such as a GitHub repository, a call transcript, or any structured data), processes it using an AI agent, and generates a visual representation via the **Eraser API**.

---

### **Possible Agent Workflows**  
1. **Codebase Visualization (Eraser API + GitHub API + LLMs)**  
   - Extract key relationships and structures from a GitHub repository.  
   - Use an AI agent to analyze repository contents (file structures, dependencies, etc.).  
   - Generate a **UML-like** diagram to visually represent the architecture.  

2. **Conversation Visualization (Eraser API + Call Transcript API + LLMs)**  
   - Retrieve call transcripts from an API.  
   - Use an LLM to extract conversation topics, speaker interactions, and key themes.  
   - Convert the insights into a **mind map** or **flowchart** using Eraser API.  

3. **Task Dependency Mapping (Eraser API + Project Management Data + LLMs)**  
   - Ingest structured task data from project management tools.  
   - Use an LLM to determine dependencies, milestones, and workflow stages.  
   - Generate a **Gantt chart or dependency graph** via Eraser API.  

---

### **Technical Considerations**  
- **Eraser API Integration:** Send structured text prompts to `https://api.eraser.io/v1/diagrams/generate` and parse the diagram output.  
- **AI Agent Processing:** Use an LLM (e.g., GPT-4-turbo) to preprocess and format data before sending it to the Eraser API.  
- **Data Ingestion & Retrieval:** Choose an input source (GitHub, transcript API, project data) and fetch relevant data dynamically.  
- **Optimization:** Since time is limited, focus on a minimal functional prototype with basic input-processing-output.  

---

### **Success Metrics**  
- Successfully generate at least one meaningful diagram from real or mock data.  
- Demonstrate LLM’s ability to preprocess and structure input effectively.  
- Discuss limitations and possible improvements in the call.  

