import unittest
import os
from unittest.mock import patch, MagicMock
from app import (
    get_repo_structure,
    generate_prompt_from_repo_structure,
    generate_diagram_from_eraser,
    GITHUB_TOKEN,
    ERASER_API_KEY,
    OPENAI_API_KEY
)

class TestDiagramGenerator(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        self.sample_repo_structure = [
            "README.md",
            "app.py",
            "requirements.txt",
            "test_app.py"
        ]
        self.test_repo_name = "arihantchoudhary/Eraser-AI"

    def test_github_token_validity(self):
        """Test if GitHub token is valid and accessible"""
        self.assertIsNotNone(GITHUB_TOKEN)
        self.assertTrue(len(GITHUB_TOKEN) > 0)
        # Test if token has correct format
        self.assertTrue(GITHUB_TOKEN.startswith("github_pat_"))

    def test_eraser_token_validity(self):
        """Test if Eraser API token is valid and accessible"""
        self.assertIsNotNone(ERASER_API_KEY)
        self.assertTrue(len(ERASER_API_KEY) > 0)

    def test_openai_token_validity(self):
        """Test if OpenAI token is valid and accessible"""
        self.assertIsNotNone(OPENAI_API_KEY)
        self.assertTrue(len(OPENAI_API_KEY) > 0)
        self.assertTrue(OPENAI_API_KEY.startswith("sk-"))

    def test_get_repo_structure_without_repo(self):
        """Test repository structure retrieval without specifying a repo"""
        result = get_repo_structure()
        self.assertIsInstance(result, list)
        self.assertTrue(len(result) > 0)
        self.assertIn("README.md", result)

    @patch('github.Github')
    def test_get_repo_structure_with_repo(self, mock_github):
        """Test repository structure retrieval with a specified repo"""
        # Mock the GitHub API response
        mock_repo = MagicMock()
        mock_content = MagicMock()
        mock_content.type = "file"
        mock_content.path = "README.md"
        mock_repo.get_contents.return_value = [mock_content]
        mock_github.return_value.get_repo.return_value = mock_repo

        result = get_repo_structure(self.test_repo_name)
        self.assertIsInstance(result, list)
        self.assertTrue(len(result) > 0)
        self.assertIn("README.md", result)

    @patch('openai.ChatCompletion.create')
    def test_generate_prompt(self, mock_openai):
        """Test OpenAI prompt generation"""
        mock_response = {
            "choices": [{
                "message": {
                    "content": "Generated prompt content"
                }
            }]
        }
        mock_openai.return_value = mock_response

        result = generate_prompt_from_repo_structure(self.sample_repo_structure)
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)

    @patch('requests.post')
    def test_generate_diagram(self, mock_post):
        """Test Eraser API diagram generation"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "success": True,
            "diagram_url": "https://example.com/diagram.png"
        }
        mock_post.return_value = mock_response

        result = generate_diagram_from_eraser("Test prompt")
        self.assertIsInstance(result, dict)
        self.assertTrue("success" in result or "error" in result)

    def test_end_to_end_integration(self):
        """Test the entire workflow from repo to diagram"""
        try:
            # Test with local repository structure
            repo_structure = get_repo_structure()
            self.assertIsInstance(repo_structure, list)
            self.assertTrue(len(repo_structure) > 0)

            prompt = generate_prompt_from_repo_structure(repo_structure)
            self.assertIsInstance(prompt, str)
            self.assertTrue(len(prompt) > 0)

            diagram = generate_diagram_from_eraser(prompt)
            self.assertIsInstance(diagram, dict)
            self.assertTrue("success" in diagram or "error" in diagram)

        except Exception as e:
            self.fail(f"End-to-end integration test failed: {str(e)}")

if __name__ == '__main__':
    unittest.main() 