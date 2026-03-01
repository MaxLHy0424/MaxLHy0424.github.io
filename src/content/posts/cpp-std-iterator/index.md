---
title: "为什么 C++ 连续容器迭代器不直接用 T*？"
description: "浅谈 C++ 连续容器迭代器的设计考量。"
published: 2025-10-07
pinned: false
tags: [C++]
category: "技术"
draft: false
---

## 0 现状

C++ 的 ContiguousContainer 或与之类似的一些设施，它们的迭代器都可以直接用 `T*`，但是这些标准库基本都有自己的包装迭代器，编译器御三家的实现见下表：

|                  Type                   |                           GNU libstdc++                           |       LLVM libc++        |                                MSVC STL                                |
| :-------------------------------------: | :---------------------------------------------------------------: | :----------------------: | :--------------------------------------------------------------------: |
| `std::initializer_list< T >::iterator`  |                            `const T*`                             |        `const T*`        |                               `const T*`                               |
|     `std::array< T, N >::iterator`      |                               `T*`                                |           `T*`           |                     `std::_Array_iterator< T, N >`                     |
|       `std::span< T >::iterator`        |     `std::__gnu_cxx::__normal_iterator< T*, std::span< T > >`     | `std::__wrap_iter< T* >` |                       `std::_Span_iterator< T >`                       |
|   `std::basic_string< T >::iterator`    | `std::__gnu_cxx::__normal_iterator< T*, std::basic_string< T > >` | `std::__wrap_iter< T* >` | `std::_String_iterator< std::_String_val< std::_Simple_types< T > > >` |
| `std::basic_string_view< T >::iterator` |                            `const T*`                             |        `const T*`        |         `std::_String_view_iterator< std::char_traits< T > >`          |
|      `std::vector< T >::iterator`       |    `std::__gnu_cxx::__normal_iterator< T*, std::vector< T > >`    | `std::__wrap_iter< T* >` | `std::_Vector_iterator< std::_Vector_val< std::_Simple_types< T > > >` |

这些包装类基本都是存一个指针在内部，然后重载各种运算符，允许转换到 `T*`，使得其表现的跟裸指针基本一致。而且在 debug 下，包装器可能多存了 `begin` 和 `end` 指针，使得各种操作可以检查有没有越界。

所以，为什么不直接用 `T*` 呢？鄙人认为有如下一些原因。

## 1 增强语义的健壮性

考虑如下代码：

```cpp
void f( std::vector< int >::iterator );
f( nullptr );
```

`nullptr` 可以转换为 `int*`，但作为迭代器，真的应该接受 `std::nullptr_t` 吗？如果是，那么就代表 “这个迭代器可以指向任意内存地址”，那么和 “迭代” 两字又有什么关联呢？所以，如果接受隐式转换，那么这是非常不合理的。

## 2 使迭代器类型互相独立

考虑如下代码：

```cpp
std::vector< char > v{ 'A', 'B', 'C' };
std::string::iterator it{ v.begin() };
```

如果迭代器是 `T*`，那么这段代码是可以通过编译的。

**这很诡异你知道吗？**

所以，**一个容器的迭代器应该表现得像一个独立类型**。

MSVC STL 直接为每个容器各写了一套迭代器，简单粗暴但是可能没什么必要。

libstdc++ 只是多加了一个模板参数作为标签，就足够区分类型和避免转换了。

然而，libc++ 并不能解决这个问题。

## 3 避免派生类指针到基类指针的转换

```cpp
struct A {};
struct B : A {};
void f( std::vector< A >::iterator );
void g()
{
    std::vector< B > v;
    f( v.begin() );
}
```

如果迭代器是 `T*` 那么上述代码就可以通过编译，但显然不应该让它通过。

还是 libc++，`std::__wrap_iter` 没有防止这个问题，甚至是特意检查了指针能转换就放行。

```cpp
template <class _Up, __enable_if_t<is_convertible<_Up, iterator_type>::value, int> = 0>
_LIBCPP_HIDE_FROM_ABI _LIBCPP_CONSTEXPR_SINCE_CXX14 __wrap_iter(const __wrap_iter<_Up>& __u) _NOEXCEPT
    : __i_(__u.base()) {}
```

## 4 for ADL

> [!NOTE]
> 在这里插入一点前置知识。
> 
> 实参依赖查找（ADL），也称为 Koenig 查找，是查找函数调用表达式中不限定函数名称的规则集，包括对重载运算符的隐式函数调用。这些函数名称除了通常不限定名称查找所考虑的作用域和命名空间外，还会在其实参的命名空间中查找。实参依赖查找使得在不同命名空间中定义的运算符成为可能。例如：
> ```cpp
> #include <iostream> 
> int main()
> {
>     std::cout << "Test\n"; // There is no operator<< in global namespace, but ADL
>                            // examines std namespace because the left argument is in
>                            // std and finds std::operator<<(std::ostream&, const char*)
>     operator<<(std::cout, "Test\n"); // Same, using function call notation
>     // However,
>     std::cout << endl; // Error: “endl” is not declared in this namespace.
>                        // This is not a function call to endl(), so ADL does not apply
>     endl(std::cout); // OK: this is a function call: ADL examines std namespace
>                      // because the argument of endl is in std, and finds std::endl
>     (endl)(std::cout); // Error: “endl” is not declared in this namespace.
>                        // The sub-expression (endl) is not an unqualified-id
> }
> ```

```cpp
#include <algorithm>
// 虽然向 std 内加东西是 UB，但这里假设不是
namespace std
{
    template < class Pointer >
    struct Iter
    {
        auto operator*() const noexcept -> std::remove_pointer_t< Pointer >&
        {
            static std::remove_pointer_t< Pointer > res;
            return res;
        }
        struct type
        {
            auto operator*() const noexcept -> std::remove_pointer_t< Pointer >&
            {
                static std::remove_pointer_t< Pointer > res;
                return res;
            }
        };
    };
    template < class T >
    struct Container1
    {
        using iterator = T*;
    };
    template < class T >
    struct Container2
    {
        using iterator = Iter< T* >;
    };
    template < class T >
    struct Container3
    {
        using iterator = typename Iter< T* >::type;
    };

}
struct A
{
    friend void iter_swap( std::Container1< A >::iterator, std::Container1< A >::iterator );
    friend void iter_swap( std::Container2< A >::iterator, std::Container2< A >::iterator );
    friend void iter_swap( std::Container3< A >::iterator, std::Container3< A >::iterator );
};
auto main() -> int
{
    std::Container1< A >::iterator i1;
    // 调用 iter_swap( A*, A* )
    iter_swap( i1, i1 );
    std::Container2< A >::iterator i2;
    // 调用 iter_swap( std::Iter< A* >, std::Iter< A* > )
    iter_swap( i2, i2 );
    std::Container3< A >::iterator i3;
    // 调用 void std::iter_swap< std::Iter< A* >::type, std::Iter< A* >::type >( std::Iter< A* >::type, std::Iter< A* >::type )
    iter_swap( i3, i3 );
}
```

我们假设了三个场景：迭代器分别为 `T*`、`std::Iter< T* >` 和 `typename std::Iter<T*>::type`。

在 `algorithm` 头文件中有一个 `std::iter_swap<>()` 函数模板，`A` 为三种迭代器类型也都自定义了 `iter_swap` 函数。

对于 `T*`，它不是 `std` 命名空间成员，所以根本不会去找 `std::iter_swap<>()`，只有一个 `A` 的版本能用。

对于 `std::Iter< T* >`，它既能找到 `std::iter_swap<>()` 也能找到 `A` 的版本。但是 `A` 版本更特殊，最后选择了 `A` 版本。

对于 `typename std::Iter<T*>::type`，它已经看不到 `A` 了！只能选择 `std::iter_swap<>()`。

## 5 内建类型的前置递增等操作只接受左值

```cpp
#include <vector>
auto f1() -> std::vector< int >::iterator;
auto f2() -> int*;
auto main() -> int
{
    ++f1();
    // ++f2();  // error: lvalue required as increment operand
}
```

这可能是本篇里最贴近大众的地方，因为很多人可能会写这样的代码 `auto&& back{ *( --v.end() ) };`，它理所应当能通过编译，但是用指针就做不到了。
