import unittest
from unittest.mock import patch, MagicMock
from scraper import get_website_url, scrape_website
import requests

class TestScraper(unittest.TestCase):

    def test_get_website_url(self):
        self.assertEqual(get_website_url("Product Hunt"), "https://www.producthunt.com/")
        self.assertEqual(get_website_url("Alternatives.to"), "https://alternativo.net/")
        self.assertEqual(get_website_url("There's an AI for That"), "https://theresanaiforthat.com/")
        self.assertEqual(get_website_url("r/modelcontextprotocol"), "https://www.reddit.com/r/modelcontextprotocol")
        self.assertIsNone(get_website_url("Unknown Site"))

    @patch('scraper.requests.get')
    def test_scrape_website_success(self, mock_get):
        # Create a mock response object
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = '<html><body><h2>Title 1</h2><h2>Title 2</h2></body></html>'
        mock_get.return_value = mock_response

        # This is to capture the print output
        import io
        from contextlib import redirect_stdout

        f = io.StringIO()
        with redirect_stdout(f):
            scrape_website("http://example.com", "Example", 'h2')
        output = f.getvalue()

        self.assertIn("--- Example (http://example.com) ---", output)
        self.assertIn("Status Code: 200", output)
        self.assertIn("Title 1", output)
        self.assertIn("Title 2", output)

    @patch('scraper.requests.get')
    def test_scrape_website_no_titles(self, mock_get):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = '<html><body><p>Some text</p></body></html>'
        mock_get.return_value = mock_response

        import io
        from contextlib import redirect_stdout

        f = io.StringIO()
        with redirect_stdout(f):
            scrape_website("http://example.com", "Example", 'h2')
        output = f.getvalue()

        self.assertIn("No titles found with the selector.", output)

    @patch('scraper.requests.get')
    def test_scrape_website_failure(self, mock_get):
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_response.text = 'Not Found'
        mock_get.return_value = mock_response

        import io
        from contextlib import redirect_stdout

        f = io.StringIO()
        with redirect_stdout(f):
            scrape_website("http://example.com", "Example", 'h2')
        output = f.getvalue()

        self.assertIn("Failed to fetch the page.", output)

if __name__ == '__main__':
    unittest.main()
