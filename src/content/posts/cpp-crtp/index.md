---
title: "漫谈 C++ CRTP"
description: "简单介绍 C++ CRTP 及其常见用法。"
published: 2025-10-07
pinned: false
tags: [C++, CRTP]
category: "技术"
draft: false
---

## 0 引入

奇特重现模板模式（Curiously Recurring Template Pattern，CRTP）是一种惯用手法。它最关键的特征在于基类 `base` 有一个模板参数 `D`，指的是它的派生类 `derived`，而 `derived` 继承自 `base` 时需要把自己传入 `base` 的模板参数中。这样就可以在 `base` 的函数里通过 `D& self{ static_cast< D& >( *this ) };` 拿到自己的真实类型，从而做一系列调用不同派生类的固定接口的操作，故也被称为编译期多态。

```cpp
template < class D >
class base
{
  protected:
    base() noexcept                         = default;
    base( const base& ) noexcept            = default;
    base& operator=( const base& ) noexcept = default;
    ~base()                                 = default;
  public:
    auto f()
    {
        static_cast< D& >( *this ).impl();
    }
};
class derived : public base< derived >
{
  public:
    auto impl()
    {
        // do something...
    }
};
```

C++ 23 引入的显示 this 指针（Deducing this）也对 CRTP 有一定增强，我们不再需要让 `base` 为类模板了，`self` 将会自动推到为 `D&`。

```cpp
class base
{
  protected:
    base() noexcept                         = default;
    base( const base& ) noexcept            = default;
    base& operator=( const base& ) noexcept = default;
    ~base()                                 = default;
  public:
    auto f( this auto&& self )
    {
        self.impl();
    }
};
class derived : public base
{
  public:
    auto impl()
    {
        // do something...
    }
};
```

## 1 编译期多态

CRTP 最广为人知的用法就是编译期多态了，但鄙人认为 CRTP 用作多态的作用十分有限，因为基类是模板类，所以我们只能通过派生类来调用正确的函数。话虽如此，它确实在标准库中也展现了自己的作用。比如 `std::enable_shared_from_this<>`，这里直接截取 libstdc++ 的源码：

```cpp

  /**
   * @brief Base class allowing use of the member function `shared_from_this`.
   * @headerfile memory
   * @since C++11
   */
  template<typename _Tp>
    class enable_shared_from_this
    {
    protected:
      constexpr enable_shared_from_this() noexcept { }

      enable_shared_from_this(const enable_shared_from_this&) noexcept { }

      enable_shared_from_this&
      operator=(const enable_shared_from_this&) noexcept
      { return *this; }

      ~enable_shared_from_this() { }

    public:
      shared_ptr<_Tp>
      shared_from_this()
      { return shared_ptr<_Tp>(this->_M_weak_this); }

      shared_ptr<const _Tp>
      shared_from_this() const
      { return shared_ptr<const _Tp>(this->_M_weak_this); }

#ifdef __glibcxx_enable_shared_from_this // C++ >= 17 && HOSTED
      /** @{
       * Get a `weak_ptr` referring to the object that has `*this` as its base.
       * @since C++17
       */
      weak_ptr<_Tp>
      weak_from_this() noexcept
      { return this->_M_weak_this; }

      weak_ptr<const _Tp>
      weak_from_this() const noexcept
      { return this->_M_weak_this; }
      /// @}
#endif

    private:
      template<typename _Tp1>
	void
	_M_weak_assign(_Tp1* __p, const __shared_count<>& __n) const noexcept
	{ _M_weak_this._M_assign(__p, __n); }

      // Found by ADL when this is an associated class.
      friend const enable_shared_from_this*
      __enable_shared_from_this_base(const __shared_count<>&,
				     const enable_shared_from_this* __p)
      { return __p; }

      template<typename, _Lock_policy>
	friend class __shared_ptr;

      mutable weak_ptr<_Tp>  _M_weak_this;
    };
```

不难发现 `std::enable_shared_from_this< T >` 的内部保存着一个派生类 `T` 对象的 `std::weak_ptr< T >`，即 `T` 继承自 `std::enable_shared_from_this< T >` 且内部有一个 `std::weak_ptr< T >`。

具体用法可参考 [cppreference 上对 `std::enable_shared_from_this<>` 的描述](https://zh.cppreference.com/w/cpp/memory/enable_shared_from_this)。

## 2 消除重复代码（同为多态思想）

其实这也是继承多态干的事情，不过因为对 `this` 指针进行了类型转换，使得其更像是直接把基类的代码复制粘贴到派生类中。

## 3 代码注入

使用 CRTP，可以在调用派生类的函数前做一些操作。例如：

```cpp
#include <print>
#include <type_traits>
struct impl
{
    auto f( this auto&& self )
    {
        std::println( "(using CRTP...)" );
        self.g();
    }
};
struct test1 final : public impl
{
    auto g()
    {
        std::println( "I am A!" );
    }
};
struct test2 final : public impl
{
    auto g()
    {
        std::println( "I am B!" );
    }
};
auto main() -> int
{
    test1{}.f();
    test2{}.f();
    return 0;
}
```

如果与元编程结合，能干的事情就更多了。例如：

```cpp
#include <chrono>
#include <print>
#include <type_traits>
struct with_time
{ };
struct impl
{
    template < typename T >
    auto f( this T&& self )
    {
        if constexpr ( std::is_base_of_v< with_time, std::decay_t< T > > ) {
            std::print( "(time: {}) ", std::chrono::system_clock::now() );
        } else {
            std::print( "(time: <unknwon>) " );
        }
        self.g();
    }
};
struct test1 final
  : public impl
  , public with_time
{
    auto g()
    {
        std::println( "I am A!" );
    }
};
struct test2 final : public impl
{
    auto g()
    {
        std::println( "I am B!" );
    }
};
auto main() -> int
{
    test1{}.f();
    test2{}.f();
    return 0;
}
```

## 4 总结

CRTP 作为自 C++ 模板机制诞生起就存在的惯用法，存在其独特的历史价值。善用这一机制，可以更好地践行 C++ 零成本抽象的设计哲学。然而，由于 C++ 的基类生命周期与派生类生命周期不同，所以要格外关注这方面的问题，**在 CRTP 的基类的构造函数和析构函数中，不要访问派生类的非静态成员，与之相关的一切都是未定义行为。**
