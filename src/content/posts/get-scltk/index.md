---
title: "获取 SCLTK"
description: "脱离电子教室软件的限制，快捷获取 SCLTK。"
published: 2026-01-01
pinned: true
tags: [电子教室软件, SCLTK]
category: "资源"
draft: false
---

## 前言

SCLTK 作为电子教室软件破解工具，饱受各种电子教室软件的针对。尤其是 “机房管理助手”，几乎封堵了绝大多数获取 SCLTK 和其他破解工具的途径。除了访问 [SCLTK 开源仓库发行版页面](https://github.com/MaxLHy0424/SCLTK/releases)，还有一些其他的方法可以方便地获取 SCLTK，在此罗列。

## 注意事项

如需开发者的 GnuPG 公钥，请从<a href="/about/" target="_blank" rel="noopener noreferrer">此网页</a>复制。

如需 SCLTK 的 GnuPG 签名文件，请点击下方链接下载。

<a href="/assets/SCLTK/SCLTK-x86_64-ucrt.exe.sig" target="_blank" rel="noopener noreferrer">x86_64-ucrt 版本签名文件</a>

<a href="/assets/SCLTK/SCLTK-i686-msvcrt.exe.sig" target="_blank" rel="noopener noreferrer">i686-msvcrt 版本签名文件</a>

下列方法不会一并获取 SCLTK 的开源许可证，请您自行阅读。

<details>
  <summary>点击展开</summary>

```
MIT License

Copyright (c) 2023 - present MaxLHy0424

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</details>

## 方法 1 - 从本站下载

“机房管理助手” 劫持了 `github.com`，为此本站提供 SCLTK 最新版本镜像。您可以点击以下链接获取 SCLTK。

<a href="/assets/SCLTK/SCLTK-x86_64-ucrt.exe" target="_blank" rel="noopener noreferrer">x86_64-ucrt 版本</a>

<a href="/assets/SCLTK/SCLTK-i686-msvcrt.exe" target="_blank" rel="noopener noreferrer">i686-msvcrt 版本</a>

## 方法 2 - 借助 `certutil` 下载

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`）。
2. 点击文件资源管理器的地址栏。

如果要下载 x86_64-ucrt 版本，请输入：

```batch
certutil -urlcache -split -f "https://maxlhy0424.is-a.dev/assets/SCLTK/SCLTK-x86_64-ucrt.exe" "SCLTK-x86_64-ucrt.exe"
```

如果要下载 i686-msvcrt 版本，请输入：

```batch
certutil -urlcache -split -f "https://maxlhy0424.is-a.dev/assets/SCLTK/SCLTK-i686-msvcrt.exe" "SCLTK-i686-msvcrt.exe"
```

3. 按回车键执行。如果失败，可以多运行几次。

## 方法 3 - 借助 VBScript 下载

“机房管理助手” 在最近的更新中提供了禁止浏览器下载文件的功能。不过仍有方法可以方便的获取 SCLTK，具体请参考如下步骤：

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`），在文件夹内创建文件 `SCLTK.vbs`。
2. 使用文本编辑器打开 `SCLTK.vbs`，复制如下代码并保存：

<details>
<summary>点击展开</summary>

```vb
Option Explicit
Dim items(1, 1)
items(0, 0) = "https://maxlhy0424.is-a.dev/assets/SCLTK/SCLTK-x86_64-ucrt.exe"
items(0, 1) = "SCLTK-x86_64-ucrt.exe"
items(1, 0) = "https://maxlhy0424.is-a.dev/assets/SCLTK/SCLTK-i686-msvcrt.exe"
items(1, 1) = "SCLTK-i686-msvcrt.exe"
Dim i
For i = 0 To UBound(items, 1)
    On Error Resume Next
    Dim http, stream
    Set http = CreateObject("MSXML2.ServerXMLHTTP")
    Set stream = CreateObject("ADODB.Stream")
    http.setOption 2, 13056
    http.Open "GET", items(i, 0), False
    http.Send    
    If Err.Number <> 0 Then
        WScript.Echo "[FAILED] Network Error: " & Err.Description
        WScript.Quit 1
    End If
    If http.Status <> 200 Then
        WScript.Echo "[FAILED] HTTP Status: " & http.Status
        WScript.Quit 1
    End If
    stream.Type = 1 
    stream.Open
    stream.Write http.ResponseBody
    stream.SaveToFile items(i, 1), 2 
    stream.Close
    If Err.Number <> 0 Then
        WScript.Echo "[FAILED] File Write Error: " & Err.Description
        WScript.Quit 1
    End If
    On Error GoTo 0
Next
WScript.Echo "OK!"
WScript.Quit 0
```
</details>

3. 运行 `SCLTK.vbs`。当弹出 “OK!” 时，SCLTK 已下载完毕。如果失败，可以多运行几次。

## 方法 4 - 借助 Python 3 下载

该方法与上一个方法相似，步骤如下：

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`），在文件夹内创建文件 `SCLTK.py`。
2. 使用文本编辑器打开 `SCLTK.py`，复制如下代码并保存：

<details>
<summary>点击展开</summary>

```python
import urllib.request
import ssl
import sys
items = [
    ("https://maxlhy0424.is-a.dev/assets/SCLTK/SCLTK-x86_64-ucrt.exe", "SCLTK-x86_64-ucrt.exe"),
    ("https://maxlhy0424.is-a.dev/assets/SCLTK/SCLTK-i686-msvcrt.exe", "SCLTK-i686-msvcrt.exe")
]
def download_file_ignore_ssl(url, file_path):
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE    
    try:
        with urllib.request.urlopen(url, context=context) as response:
            if response.status == 200:
                with open(file_path, 'wb') as f:
                    while True:
                        chunk = response.read(8192)
                        if not chunk:
                            break
                        f.write(chunk)
                return True
            else:
                print(f"[FAILED] HTTP Status: {response.status}")
                return False
    except Exception as e:
        print(f"[FAILED] {e}")
        return False
def main():
    print("Downloading...")
    for url, filename in items:
        print(f"Downloading: {filename}...")
        if not download_file_ignore_ssl(url, filename):
            sys.exit(1)
    print("OK!")
    sys.exit(0)
if __name__ == "__main__":
    main()
```
</details>

3. 使用 Python 3 运行 `SCLTK.py`。当输出 “OK!” 时，SCLTK 已下载完毕。如果失败，可以多运行几次。

## 方法 5 - 借助 C++ 与 Windows API 下载

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`），在文件夹内创建文件 `SCLTK.cpp`。
2. 使用 Dev-C++ 打开 `SCLTK.cpp`，复制如下代码并保存：

<details>
<summary>点击展开</summary>

```cpp
#include <windows.h>
#include <wininet.h>
#include <fstream>
#include <iostream>
#include <vector>
bool download_file_ignore_ssl( const wchar_t* url, const wchar_t* file_path )
{
    HINTERNET internet_handle = InternetOpenW( L"MyDownloader", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0 );
    HINTERNET url_handle      = NULL;
    bool success              = false;
    if ( internet_handle == NULL ) {
        std::wcerr << L"InternetOpen failed. Error: " << GetLastError() << std::endl;
        return false;
    }
    DWORD flags
      = INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID | INTERNET_FLAG_IGNORE_REDIRECT_TO_HTTP
      | INTERNET_FLAG_IGNORE_REDIRECT_TO_HTTPS | INTERNET_FLAG_SECURE | INTERNET_FLAG_RELOAD;
    url_handle = InternetOpenUrlW( internet_handle, url, NULL, 0, flags, 0 );
    if ( url_handle == NULL ) {
        std::wcerr << L"InternetOpenUrl failed. Error: " << GetLastError() << std::endl;
        InternetCloseHandle( internet_handle );
        return false;
    }
    std::ofstream output( file_path, std::ios::binary );
    if ( output.is_open() ) {
        const DWORD BUFFER_SIZE = 8192;
        BYTE buffer[ BUFFER_SIZE ];
        DWORD bytesRead = 0;
        while ( InternetReadFile( url_handle, buffer, BUFFER_SIZE, &bytesRead ) && bytesRead > 0 ) {
            output.write( ( char* ) buffer, bytesRead );
        }
        output.close();
        success = true;
    } else {
        std::wcerr << L"Failed to create local file: " << file_path << std::endl;
    }
    InternetCloseHandle( url_handle );
    InternetCloseHandle( internet_handle );
    return success;
}
int main()
{
    std::cout << "Downloading...\n";
    struct item
    {
        const wchar_t* url;
        const wchar_t* file_path;
    };
    const item items[] = {
      {L"https://maxlhy0424.is-a.dev/assets/SCLTK/SCLTK-x86_64-ucrt.exe", L"SCLTK-x86_64-ucrt.exe"},
      {L"https://maxlhy0424.is-a.dev/assets/SCLTK/SCLTK-i686-msvcrt.exe", L"SCLTK-i686-msvcrt.exe"}
    };
    for ( std::size_t i = 0; i < sizeof( items ) / sizeof( item ); ++i ) {
        std::wcout << L"Downloading: " << items[ i ].file_path << L"..." << std::endl;
        if ( !download_file_ignore_ssl( items[ i ].url, items[ i ].file_path ) ) {
            std::cerr << "[FAILED] Could not download file.\n";
            return 1;
        }
    }
    std::cout << "OK!" << '\n';
    return 0;
}
```
</details>

3. 在编译选项中添加 `-lwininet`，编译并运行。当输出 “OK!” 时，SCLTK 已下载完毕。如果失败，可以多运行几次。