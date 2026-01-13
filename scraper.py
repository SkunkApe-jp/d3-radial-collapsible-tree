import json
import requests
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def get_website_url(name):
    """Constructs the full URL for a given website name."""
    name_lower = name.lower()
    if name_lower == "alternatives.to":
        return "https://alternativo.net/"
    elif name_lower == "there's an ai for that":
        return "https://theresanaiforthat.com/"
    elif name.startswith("r/"):
        return f"https://www.reddit.com/{name}"
    else:
        return None

def scrape_website(url, name, title_selector):
    """A generic function to scrape a website."""
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"--- {name} ({url}) ---")
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            titles = soup.select(title_selector)
            if titles:
                print(f"Found {len(titles)} titles with selector '{title_selector}':")
                for title in titles[:5]:
                    print(title.get_text().strip())
            else:
                print(f"No titles found with the selector: '{title_selector}'")
        else:
            print(f"Failed to fetch the page with status code: {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"Error scraping {url}: {e}")

def main():
    """Main function to read the JSON and start scraping."""
    print("Attempting to scrape websites with generic selectors (h1, h2, h3).")
    print("Note: Web scraping is challenging because website structures change frequently.")
    print("The selectors used here are best-guesses and may not work for all sites.")
    
    with open('files/b907033b83bdcaf8c3abc800465fc9ba0216b692c87a030bd4c20586b23010a7803b54082056f1ee95536114977d9c6d24253bef2b559f10ad3aba0558e4eb0d.json', 'r') as f:
        data = json.load(f)

    for month in data.get("children", []):
        print(f"\n--- Scraping for {month['name']} ---")
        for item in month.get("children", []):
            name = item.get("name")
            
            if name == "Product Hunt":
                continue

            url = get_website_url(name)

            if url:
                if "alternativo.net" in url:
                    scrape_website(url, name, 'h1, h2, h3')
                elif "theresanaiforthat.com" in url:
                    scrape_website(url, name, 'h1, h2, h3')
                elif "reddit.com" in url:
                    if "children" in item:
                        for sub_item in item.get("children", []):
                            sub_name = sub_item.get("name")
                            sub_url = get_website_url(sub_name)
                            if sub_url:
                                scrape_website(sub_url, sub_name, 'h1, h2, h3')
                    else:
                        scrape_website(url, name, 'h1, h2, h3')


if __name__ == "__main__":
    main()
