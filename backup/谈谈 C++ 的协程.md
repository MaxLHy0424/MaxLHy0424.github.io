协程 (Coroutine) 的概念由来已久, 一句话来解释就是 "可以被挂起 (暂停执行) 并恢复的函数".

然而, C++ 中, 直到 C++ 20 的发布, 才正式引入了协程. 对于开发者来说, 这地毫不亚于 C++ 11 中正式引入线程 (Thread) 一样. 但 C++ 20 中, 仅仅是给了两个关键字 (即 `co_return` 和 `co_await`) 和一个运算符 (即 `co_await`), 还有协程相关的底层库 (比如 `std::coroutine_handle`). 这显然没有协程在 Python 等其他编程语言中 "开箱即用".

不过首先要清楚, 我们为什么需要使用协程.

目前主流语言基本上都选择了多线程作为并发设施, 与线程相关的概念就是抢占式多任务 (Preemptive Multitasking), 而与协程相关的是协作式多任务.

其实不管是进程还是线程, 每次阻塞和切换都需要陷入系统调用 (System Call), 先让 CPU 运行操作系统的调度程序, 然后再由调度程序决定该跑哪一个进程或线程.

而且由于抢占式调度执行顺序无法确定的特点, 使用线程时需要非常小心地处理同步问题, 而协程完全不存在这个问题 (事件驱动和异步程序也有同样的优点).

因为协程是用户自己来编写调度逻辑的, 对于我们的 CPU 来说, 协程其实是单线程, 所以 CPU 不用去考虑怎么调度和切换上下文, 这就省去了 CPU 的切换开销, 所以协程的性能开销在一定程度上又好于多线程.

所以综合看来, 协程的有点有以下几点:

- 无需系统内核的上下文切换, 减小开销.
- 无需原子操作锁定及同步的开销, 不用担心资源共享的问题.
- 单线程即可实现高并发, 单核 CPU 即便支持上万的协程都不是问题, 所以很适合用于高并发处理, 尤其是在应用在网络爬虫中.

但因此, 协程也存在以下缺点:

- 无法充分利用 CPU 多核.
- 处处都要使用非阻塞代码.

但问题来了, C++ 中的协程, 正如上文所述, **非常简陋**, 几乎所有东西都需要程序员自己手搓, 而且可能会出现各种问题. 另外由于协程的特性, 所有的协程函数几乎无法执行 RVO (Return Value Optimization, 返回值优化) 和 NRVO (Named Return Value Optimization, 命名返回值优化), 很多情况下需要手动调用 `std::move` 来降低性能开销. 况且移动构造的开销也不一定低.

那么, C++ 中的协程究竟有什么应用场景呢?

在此之前, 先要了解 C++ 23 加入的类模板 `std::generator`. 顾名思义, 其作用就是充当 "生成器". 如果不是很理解, 可以参考 [cppreference 上的文档说明](https://zh.cppreference.com/w/cpp/coroutine/generator).

如果现在需要输出 1 ~ 100 的所有数字, 且输出函数内部实现使用范围 for 循环来输出, 可以怎么写?

如果不使用协程, 可能会这么写:
```cpp
#include <deque>
#include <print>
auto f()
{
    std::deque< int > lst;
    for ( auto i{ 1 }; i <= 100; ++i ) {
        lst.emplace_back( i );
    }
    return lst;
}
auto output( auto &&_obj )
{
    for ( const auto &i : _obj ) {
        std::print( "{} ", i );
    }
}
auto main() -> int
{
    output( f() );
    return 0;
}
```

如果使用协程 (这里使用 `std::generator`), 可以这么写:

```cpp
#include <generator>
#include <print>
auto f() -> std::generator< int >
{
    for ( auto i{ 1 }; i <= 100; ++i ) {
        co_yield i;
    }
}
auto output( auto &&_obj )
{
    for ( const auto &i : _obj ) {
        std::print( "{} ", i );
    }
}
auto main() -> int
{
    output( f() );
    return 0;
}
```

两种写法的运行结果都是一样的. 但是, 不妨想一下, 如果需要生成 1 ~ 1e8 之间的数字, 或者数字的类型是 `long long`, 甚至改成生成字符串...... 这样, 内存迟早会消耗完, 而在此之前, 根本无法输出结果.

现在再次审视下协程的定义, **"可以被挂起 (暂停执行) 并恢复的函数"**, 这就是协程最大的优点.

但再次重申, **C++ 中的协程非常简陋, 一切都需要程序员自己写**. 这就是 C++ 的协程的最大缺点.

~当然我们不可能连夜说服标准委员会去添加一个 "开箱即用" 的协程库,~ 目前较为成熟的解决方案就是使用第三方库. 如果您感兴趣的话, 也可以试试我写的协程模板类. 它使用 `std::optional` 存储返回值, 支持在范围 for 循环中使用, 支持 `co_return` 和 `co_yield`. 代码见下:

```cpp
#include <coroutine>
#include <optional>
class coroutine_void final {
  public:
    struct promise_type final {
        auto get_return_object()
        {
            return coroutine_void{ handle::from_promise( *this ) };
        }
        static auto initial_suspend() noexcept
        {
            return std::suspend_always{};
        }
        static auto final_suspend() noexcept
        {
            return std::suspend_always{};
        }
        static auto return_void() noexcept { }
        [[noreturn]]
        static auto unhandled_exception()
        {
            throw;
        }
        auto await_transform() -> void                               = delete;
        auto operator=( const promise_type & ) -> promise_type &     = default;
        auto operator=( promise_type && ) noexcept -> promise_type & = default;
        promise_type()                                               = default;
        promise_type( const promise_type & )                         = default;
        promise_type( promise_type && ) noexcept                     = default;
        ~promise_type()                                              = default;
    };
    using handle = std::coroutine_handle< promise_type >;
    auto empty() const noexcept
    {
        return coroutine_handle_ == nullptr;
    }
    auto done() const noexcept
    {
        return coroutine_handle_.done();
    }
    auto address() const noexcept
    {
        return coroutine_handle_.address();
    }
    auto destroy() const
    {
        coroutine_handle_.destroy();
    }
    auto safe_destroy() noexcept
    {
        if ( !empty() ) {
            destroy();
            coroutine_handle_ = {};
        }
    }
    auto reset( coroutine_void &&_src )
    {
        if ( this != &_src ) {
            if ( !empty() ) {
                destroy();
            }
            coroutine_handle_      = _src.coroutine_handle_;
            _src.coroutine_handle_ = {};
        }
    }
    auto resume() const
    {
        coroutine_handle_.resume();
    }
    auto safe_resume() const noexcept
    {
        if ( !done() ) {
            resume();
        }
    }
    auto operator=( const coroutine_void & ) -> coroutine_void & = delete;
    auto operator=( coroutine_void &&_src ) -> coroutine_void &
    {
        reset( std::move( _src ) );
        return *this;
    }
    coroutine_void() = default;
    coroutine_void( const handle _coroutine_handle )
      : coroutine_handle_{ _coroutine_handle }
    { }
    coroutine_void( const coroutine_void & ) = delete;
    coroutine_void( coroutine_void &&_src ) noexcept
      : coroutine_handle_{ _src.coroutine_handle_ }
    {
        _src.coroutine_handle_ = {};
    }
    ~coroutine_void()
    {
        if ( !empty() ) {
            coroutine_handle_.destroy();
        }
    }
  private:
    handle coroutine_handle_{};
};
template < std::movable _type_ >
class coroutine final {
  public:
    struct promise_type final {
        std::optional< _type_ > current_value{ std::nullopt };
        auto get_return_object()
        {
            return coroutine< _type_ >{ handle::from_promise( *this ) };
        }
        static auto initial_suspend() noexcept
        {
            return std::suspend_always{};
        }
        static auto final_suspend() noexcept
        {
            return std::suspend_always{};
        }
        auto yield_value( _type_ _value ) noexcept
        {
            current_value = std::move( _value );
            return std::suspend_always{};
        }
        auto yield_value( std::nullopt_t ) noexcept
        {
            current_value = std::nullopt;
            return std::suspend_always{};
        }
        auto return_value( _type_ _value ) noexcept
        {
            current_value = std::move( _value );
        }
        auto return_value( std::nullopt_t ) noexcept
        {
            current_value = std::nullopt;
        }
        [[noreturn]]
        static auto unhandled_exception()
        {
            throw;
        }
        auto await_transform() -> void                               = delete;
        auto operator=( const promise_type & ) -> promise_type &     = default;
        auto operator=( promise_type && ) noexcept -> promise_type & = default;
        promise_type()                                               = default;
        promise_type( const promise_type & )                         = default;
        promise_type( promise_type && ) noexcept                     = default;
        ~promise_type()                                              = default;
    };
    using handle = std::coroutine_handle< promise_type >;
    class iterator final {
      private:
        const handle coroutine_handle_;
      public:
        auto operator++() -> coroutine< _type_ >::iterator &
        {
            coroutine_handle_.resume();
            return *this;
        }
        auto operator++( int ) -> coroutine< _type_ >::iterator
        {
            coroutine_handle_.resume();
            return *this;
        }
        auto &operator*()
        {
            return coroutine_handle_.promise().current_value;
        }
        const auto &operator*() const
        {
            return coroutine_handle_.promise().current_value;
        }
        auto operator&() const
        {
            return &coroutine_handle_.promise().current_value;
        }
        auto operator==( std::default_sentinel_t ) const
        {
            return !coroutine_handle_ || coroutine_handle_.done();
        }
        auto operator=( const iterator & ) -> iterator &     = default;
        auto operator=( iterator && ) noexcept -> iterator & = default;
        iterator( const handle _coroutine_handle )
          : coroutine_handle_{ _coroutine_handle }
        { }
        iterator( const iterator & )     = default;
        iterator( iterator && ) noexcept = default;
        ~iterator()                      = default;
    };
    auto empty() const noexcept
    {
        return coroutine_handle_ == nullptr;
    }
    auto done() const noexcept
    {
        return coroutine_handle_.done();
    }
    auto address() const noexcept
    {
        return coroutine_handle_.address();
    }
    auto destroy() const
    {
        coroutine_handle_.destroy();
    }
    auto safe_destroy() noexcept
    {
        if ( !empty() ) {
            destroy();
            coroutine_handle_ = {};
        }
    }
    auto reset( coroutine< _type_ > &&_src )
    {
        if ( this != &_src ) {
            if ( !empty() ) {
                destroy();
            }
            coroutine_handle_      = _src.coroutine_handle_;
            _src.coroutine_handle_ = {};
        }
    }
    auto resume() const
    {
        coroutine_handle_.resume();
    }
    auto safe_resume() const noexcept
    {
        if ( !done() ) {
            resume();
        }
    }
    auto copy_optional() const
    {
        return coroutine_handle_.promise().current_value;
    }
    auto resume_and_copy_optional() const
    {
        resume();
        return coroutine_handle_.promise().current_value;
    }
    auto safe_resume_and_copy_optional() const noexcept
    {
        safe_resume();
        return coroutine_handle_.promise().current_value;
    }
    auto &reference_optional() noexcept
    {
        return coroutine_handle_.promise().current_value;
    }
    auto &resume_and_reference_optional()
    {
        resume();
        return coroutine_handle_.promise().current_value;
    }
    auto &safe_resume_and_reference_optional() noexcept
    {
        safe_resume();
        return coroutine_handle_.promise().current_value;
    }
    auto &&move_optional() noexcept
    {
        return std::move( coroutine_handle_.promise().current_value );
    }
    auto &&resume_and_move_optional() noexcept
    {
        resume();
        return std::move( coroutine_handle_.promise().current_value );
    }
    auto &&safe_resume_and_move_optional() noexcept
    {
        safe_resume();
        return std::move( coroutine_handle_.promise().current_value );
    }
    auto begin()
    {
        if ( !empty() ) {
            coroutine_handle_.resume();
        }
        return iterator{ coroutine_handle_ };
    }
    auto end() noexcept
    {
        return std::default_sentinel_t{};
    }
    auto operator=( const coroutine< _type_ > & ) -> coroutine< _type_ > & = delete;
    auto operator=( coroutine< _type_ > &&_src ) noexcept -> coroutine< _type_ > &
    {
        reset( std::move( _src ) );
        return *this;
    }
    coroutine() = default;
    coroutine( const handle _coroutine_handle )
      : coroutine_handle_{ _coroutine_handle }
    { }
    coroutine( const coroutine< _type_ > & ) = delete;
    coroutine( coroutine< _type_ > &&_src ) noexcept
      : coroutine_handle_{ _src.coroutine_handle_ }
    {
        _src.coroutine_handle_ = {};
    }
    ~coroutine()
    {
        safe_destroy();
    }
  private:
    handle coroutine_handle_{};
};
```

综合来看, C++ 标准中的协程支持还算不上完善, 况且能采用上 C++ 20 及以上标准进行开发的项目本就不多. 不过支持了总是好事. 协程只是 C++ 并发编程中的沧海一粟, 仅此而已.