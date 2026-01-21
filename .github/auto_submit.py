from xml.etree import ElementTree as ET
from datetime import datetime

HOST = "https://MaxLHy0424.github.io"
KEY = "70f471e35a814770be089b0701799ac2"

def get_posts(rss_path):
    try:
        tree = ET.parse(rss_path)
        root = tree.getroot()
        channel = root.find('channel')
        if not channel:
            raise ValueError("cannot find <channel>")
        posts = []
        for item in channel.findall('item'):
            link_elem = item.find('link')
            pubdate_elem = item.find('pubDate')
            if not link_elem or not pubdate_elem or not link_elem.text or not pubdate_elem.text:
                continue
            url = link_elem.text.strip()
            pubdate_str = pubdate_elem.text.strip()
            if "/post/" in url and url.endswith('.html'):
                try:
                    pubdate = datetime.strptime(pubdate_str, '%a, %d %b %Y %H:%M:%S %z')
                    posts.append((url, pubdate))
                except ValueError:
                    print(f"cannot parse '{pubdate_str}', skip URL: {url}")
                    continue
        posts.sort(key=lambda x: x[1], reverse=True)
        result = [post[0] for post in posts]
        return result
    except FileNotFoundError:
        print(f"cannot find {rss_path}")
        return []
    except ET.ParseError:
        print(f"{rss_path} is invalid")
        return []
    except Exception as e:
        print(f"unknown error: {str(e)}")
        return []

def ping_bing(url_list):
    url = 'https://www.bing.com/indexnow'
    headers = {
      'Content-Type': 'application/json; charset=utf-8',
    }
    data = {
      "host": HOST,
      "key": KEY,
      "keyLocation": f"https://{HOST}/{KEY}.txt",
      "urlList": url_list
    }
    response = requests.post(url, headers=headers, json=data)
    return response

if __name__ == "__main__":
    sitemap_path = "../rss.xml"
    url_list = get_posts(sitemap_path)
    url_list.insert(0, f'https://{HOST}/')
    print(url_list)
    response = ping_bing(url_list)
    print(response.status_code)
    print(response.text)