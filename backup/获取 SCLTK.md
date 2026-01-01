## 0 总述

SCLTK 作为机房控制软件破解工具，很容易受到各种控制软件的限制。尤其是 “机房管理助手”，几乎封堵了绝大多数获取 SCLTK 和其他破解工具的途径。除了访问 [SCLTK 开源仓库发行版页面](https://github.com/MaxLHy0424/SCLTK/releases)，还有一些其他的方法可以方便地获取 SCLTK，在此罗列。同时，欢迎各位读者朋友评论其他的获取方法。

## 1 调用 Windows API 下载

> [!NOTE]
> SCLTK 的开源许可证内容如下，如有需要请自行保存。
> <details>
>
> <summary>点击展开</summary>
>
> ```
> MIT License
> 
> Copyright (c) 2023 - present MaxLHy0424
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
> ```
>
> </details>

“机房管理助手” 在最近的更新中提供了禁止浏览器下载文件的功能。不过仍有方法可以方便的获取 SCLTK，具体请参考如下步骤：

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`），在文件夹内创建文件 `SCLTK.cpp`、`SCLTK-i686-msvcrt.cpp`、`SCLTK-x86_64-ucrt.cpp`。
2. 使用 Dev-C++ 打开 `SCLTK.cpp`，复制如下代码并保存：

<details>
<summary>点击展开</summary>

```cpp
#include <windows.h>
#include <iostream>
int main()
{
    std::cout << "Downloading...\n";
    struct item
    {
        const wchar_t *url;
        const wchar_t *file_path;
    };
    const item items[]{
      {L"https://MaxLHy0424.github.io/assets/%2325/SCLTK-x86_64-ucrt.exe", L"SCLTK-x86_64-ucrt.exe"},
      {L"https://MaxLHy0424.github.io/assets/%2325/SCLTK-i686-msvcrt.exe", L"SCLTK-i686-msvcrt.exe"}
    };
    typedef HRESULT( WINAPI * func_t )( LPUNKNOWN pCaller, LPCWSTR szURL, LPCWSTR szFileName, DWORD dwReserved, LPVOID lpfnCB );
    struct dll_manager
    {
        HMODULE dll;
        dll_manager( HMODULE dll_handle )
          : dll( dll_handle )
        { }
        ~dll_manager()
        {
            FreeLibrary( dll );
        }
    };
    const dll_manager url_mon = LoadLibraryW( L"urlmon.dll" );
    if ( !url_mon.dll ) {
        std::cerr << "[FAILED] " << HRESULT_FROM_WIN32( GetLastError() ) << '\n';
        return 1;
    }
    func_t url_download_to_file_w = reinterpret_cast< func_t >( GetProcAddress( url_mon.dll, "URLDownloadToFileW" ) );
    if ( !url_download_to_file_w ) {
        std::cerr << "[FAILED] " << HRESULT_FROM_WIN32( GetLastError() ) << '\n';
        return 1;
    }
    for ( std::size_t i = 0; i < sizeof( items ) / sizeof( item ); ++i ) {
        HRESULT hr = url_download_to_file_w( NULL, items[ i ].url, items[ i ].file_path, 0, NULL );
        if ( FAILED( hr ) ) {
            std::cerr << "[FAILED] " << hr << '\n';
            return 1;
        }
    }
    std::cout << "OK!" << '\n';
    return 0;
}
```
</details>

3. 编译并运行，等待 SCLTK 下载完毕。当输出 “OK!” 时，SCLTK 已下载完毕。

## 2 借助 Python 3 下载

该方法与上一个方法相似，步骤如下：

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`），在文件夹内创建文件 `SCLTK.py`、`SCLTK-i686-msvcrt.cpp`、`SCLTK-x86_64-ucrt.cpp`。
2. 使用文本编辑器打开 `SCLTK.py`，复制如下代码并保存：

<details>
<summary>点击展开</summary>

```python
import sys
import ctypes
from ctypes import wintypes
print("Downloading...")
items = [
    ("https://MaxLHy0424.github.io/assets/%2325/SCLTK-x86_64-ucrt.exe", "SCLTK-x86_64-ucrt.exe"),
    ("https://MaxLHy0424.github.io/assets/%2325/SCLTK-i686-msvcrt.exe", "SCLTK-i686-msvcrt.exe")
]
try:
    urlmon = ctypes.WinDLL('urlmon.dll')
except OSError:
    print(f"[FAILED] Cannot load urlmon.dll", file=sys.stderr)
    sys.exit(1)
URLDownloadToFileW = urlmon.URLDownloadToFileW
URLDownloadToFileW.argtypes = [
    ctypes.c_void_p,
    wintypes.LPCWSTR,
    wintypes.LPCWSTR,
    wintypes.DWORD,
    ctypes.c_void_p
]
URLDownloadToFileW.restype = ctypes.c_long
for url, file_path in items:
    hr = URLDownloadToFileW(None, url, file_path, 0, None)
    if hr < 0:
        print(f"[FAILED] {hr}", file=sys.stderr)
        sys.exit(1)
print("OK!")
```
</details>

1. 使用 Python 3 运行 `SCLTK.py`。当输出 “OK!” 时，SCLTK 已下载完毕。

## 3 借助 VBScript 下载

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`），在文件夹内创建文件 `SCLTK.vbs`、`SCLTK-i686-msvcrt.cpp`、`SCLTK-x86_64-ucrt.cpp`。
2. 使用文本编辑器打开 `SCLTK.vbs`，复制如下代码并保存：

<details>
<summary>点击展开</summary>

```python
Option Explicit
Sub Main()
    Dim urls(1)
    Dim files(1)
    urls(0) = "https://MaxLHy0424.github.io/assets/%2325/SCLTK-x86_64-ucrt.exe"
    files(0) = "SCLTK-x86_64-ucrt.exe"
    urls(1) = "https://MaxLHy0424.github.io/assets/%2325/SCLTK-i686-msvcrt.exe"
    files(1) = "SCLTK-i686-msvcrt.exe"
    Dim i
    For i = 0 To UBound(urls)
        If DownloadFile(urls(i), files(i)) <> 0 Then
            WScript.Quit 1
        End If
    Next
    WScript.Echo "OK!"
    WScript.Quit 0
End Sub
Function DownloadFile(strUrl, strFile)
    On Error Resume Next
    Dim objHTTP, objStream
    Set objHTTP = CreateObject("MSXML2.XMLHTTP")
    objHTTP.Open "GET", strUrl, False
    objHTTP.Send
    If Err.Number <> 0 Then
        WScript.Echo "[FAILED] " & Err.Description
        DownloadFile = 1
        Exit Function
    End If
    If objHTTP.Status <> 200 Then
        WScript.Echo "[FAILED] HTTP " & objHTTP.Status
        DownloadFile = 1
        Exit Function
    End If
    Set objStream = CreateObject("ADODB.Stream")
    objStream.Type = 1
    objStream.Open
    objStream.Write objHTTP.responseBody
    objStream.SaveToFile strFile, 2
    objStream.Close
    If Err.Number <> 0 Then
        WScript.Echo "[FAILED] " & Err.Description
        DownloadFile = 1
        Exit Function
    End If
    DownloadFile = 0
End Function
Call Main
```
</details>

3. 运行 `SCLTK.vbs`。当弹出 “OK!” 时，SCLTK 已下载完毕。