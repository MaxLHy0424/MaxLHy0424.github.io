import requests
import os
from datetime import datetime

GITHUB_OWNER = "MaxLHy0424"
GITHUB_REPO = "MaxLHy0424.github.io"
HOST = "MaxLHy0424.github.io"
KEY = "70f471e35a814770be089b0701799ac2"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def get_posts():
    api_url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/docs/post"
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    try:
        response = requests.get(api_url, headers=headers, timeout=15)
        response.raise_for_status()
        files = response.json()
        post_urls = []
        for file in files:
            if file["type"] == "file" and file["name"].endswith(".html"):
                post_url = f"https://{HOST}/post/{file['name']}"
                post_urls.append(post_url)
        post_urls.sort(reverse=True)
        return post_urls
    except requests.exceptions.RequestException as e:
        print(f"获取post文件失败：{str(e)}")
        return []
    except Exception as e:
        print(f"未知错误：{str(e)}")
        return []

def ping_bing(url_list):
    if not url_list:
        print("URL列表为空，无需提交")
        return None
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
    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        return response
    except requests.exceptions.RequestException as e:
        print(f"提交Bing失败：{str(e)}")
        return None

if __name__ == "__main__":
    url_list = get_posts()
    url_list.insert(0, f'https://{HOST}/')
    print("待提交的URL列表：")
    for idx, url in enumerate(url_list, 1):
        print(f"{idx}. {url}")
    response = ping_bing(url_list)
    if response:
        print(f"\nBing响应状态码：{response.status_code}")
        print(f"Bing响应内容：{response.text}")
    else:
        print("\n提交Bing请求失败")