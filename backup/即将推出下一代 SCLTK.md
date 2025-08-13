经过一个半月的开发, SCLTK v6.4.0 即将进入功能冻结阶段, 接下来的一个月的开发将以性能优化和兼容性增强为主.

从此版本正式发布起, SCLTK 日后更新将以优化和维护为主, 针对新功能的开发将逐步减少 ~~, 直到我想到新的活~~ --- 不用担心, SCLTK 仍然将保持活跃开发.

在此, 总结这一个半月的开发成果罢. (笑)

---

- 提升综合性能, 减小二进制文件大小.
- 重构破解/恢复引擎为 Windows API 实现.
- 优化破解/恢复用户交互体验.
- 新增执行全部规则.
- 新增 "学生机房管理助手" 内建规则.
- 拆分选项为各个独立的配置分类.
- 新增 "破解与恢复" 选项 "快速模式".
- 移除 "破解与恢复" 选项 "并行操作 (预览版)".
- 移除 "破解与恢复" 选项 "* 修复操作系统环境".
- 修改 "杂项" 选项 "** 禁用标 * 选项热重载" (`disable_x_option_hot_reload`) 为 "禁用以上选项热重载 (下次启动时生效)" (`~no_hot_reload`) 并移入 "窗口设置".
- 修改配置文件中选项型配置的保存格式.
- 合并 `custom_rules_exec` 和 `custom_rules_serv` 为 `custom_rules`.
- 解析配置文件时忽略每行前导和末尾的空白字符.
- 解析配置文件时忽略每个标签中括号中的空白字符.
- 新增打开配置文件状态提示.
- 新增在 "配置" 查看配置文件解析规则.
- 新增在 "配置" 查看自定义规则帮助信息.
- 重构 "工具箱" 中 "启动命令提示符" 为纯 Windows API 实现.
- 新增在 "工具箱" 下的 "恢复操作系统组件".
- 新增在 "工具箱" 下的 "重置 Google Chrome 管理策略".
- 新增在 "工具箱" 下的 "重置 Microsoft Edge 管理策略".
- 移除在 "工具箱" 下的 "恢复 Google Chrome 离线游戏".
- 移除在 "工具箱" 下的 "恢复 Microsoft Edge 离线游戏".
- 修改 "关于" 的个别措辞.
- 修改 "关于" 页面时间格式以符合 ISO 8601.
- 修复 "关于" 页面点击 URL 后短暂卡顿.
- 缓解在 Windows 7/8/8.1 下清屏操作可能无法正常生效.
- 修改个别操作休眠时间以平衡性能和用户体验.
- 取消使用等待式返回, 改为按键盘任意键返回.
- 补全在发行文件中遗失的 `LICENSE` 文件.
- 更换图标.
- 更新文档.

<details>
<summary>点击查看更多技术性内容</summary>

- 将 `src/cpp_utils` 移动至 `include/cpp_utils`.
- `cpp_utils/compiler.hpp`: 新增.
- `cpp_utils/math.hpp`: 新增.
- `cpp_utils/meta.hpp`: 新增.
- `cpp_utils/function.hpp`: 移除
- `cpp_utils/type_tools.hpp`: 移除
- `cpp_utils/const_string.hpp` (原 `constant_string.hpp`): 移除比较函数.
- `cpp_utils/const_string.hpp` (原 `constant_string.hpp`): 添加 `make_repeated_const_string<>` 函数模板.
- `cpp_utils/const_string.hpp` (原 `constant_string.hpp`): 重命名 `constant_string` 为 `basic_const_string`, 修改相关类型别名.
- `cpp_utils/const_string.hpp` (原 `constant_string.hpp`): `basic_const_string<>` 支持从 `std::array<>` 构造 (实现上推荐 `std::array<>` 对象避免以 `\0` 结尾)
- `cpp_utils/diagnostics.hpp`: 微调 `make_log` 返回内容格式.
- `cpp_utils/multithread.hpp`: 重命名 `parallel_for_each_impl` 为 `parallel_for_each`.
- `cpp_utils/multithread.hpp`: `parallel_for_each` 形参中允许 `std::is_same_v< decltype( begin ), decltype( end ) >` 为 `false`.
- `cpp_utils/multithread.hpp`: 修复 `parallel_for_each` 中错误的对象移动.
- `cpp_utils/multithread.hpp`: 优化 `parallel_for_each` 实现.
- `cpp_utils/multithread.hpp`: 弃用 `thread_manager`.
- `cpp_utils/windows_app_tools.hpp`: 新增服务和注册表操作相关函数.
- `cpp_utils/windows_app_tools.hpp`: 新增 `press_any_key_to_continue` 函数 (即 "按任意键继续").
- `cpp_utils/windows_app_tools.hpp`: 修改部分函数签名.
- `cpp_utils/windows_console_ui.hpp`: 常量 `func_back` 和 `func_exit` 类型从 `func_return_t` (`bool`) 改为枚举类型 `func_action`.
- `cpp_utils/windows_console_ui.hpp`: 移除 `func_args` 成员变量的 `const` 限定符.
- `cpp_utils/windows_console_ui.hpp`: 允许省略回调函数的形参中的 `func_args`.
- `cpp_utils/windows_console_ui.hpp`: 修复 `set_limits` (先更名为 `set_constraints`) 成员函数在 `is_lock_text` 为 `true` 时仍然可通过右键控制台空白处修改文本的问题.
- `cpp_utils/windows_console_ui.hpp`: 重构 `invoke_func_`.
- `cpp_utils/windows_console_ui.hpp`: 修改 `get_event_` 中休眠时间从 `50ms` 降至 `20ms`.
- `cpp_utils/windows_definitions.hpp` (原文件名拼写错误已修正): 添加服务和注册表相关值.
- `cpp_utils/windows_definitions.hpp` (原文件名拼写错误已修正): 移除 `console_text::default_attrs`
- `cpp_utils/windows_definitions.hpp` (原文件名拼写错误已修正): 新增 `console_text::foreground_white` 和 `console_text::background_white`.
- 封装 `core` 内部实现细节至命名空间 `core::details`.
- 使用 `cpp_utils::type_list<>` 简化配置节点类注册.
- 修改 `core::config_node_impl` 的部分成员函数名称及其调用的函数名称.
- 移除 `core::option_set` 和 `core::option_op`.
- 新增选项型配置的基类 `core::details::basic_option_like_config_node<>`.
- 简化选项型配置的选项查找实现.
- 优化选项型配置数据加载/同步性能.
- 优化线程启动代码可扩展性.
- 修改 `core::default_thread_sleep_time` 为 `200ms`.
- 优化破解/恢复执行管理器实现.
- 优化破解/恢复在多线程执行时创建的线程数 (使用 `std::ranges::max( std::thread::hardware_concurrency() / 2, 4u )` 决定).
- 减少使用 lambda 表达式和函数对象以解决符号膨胀.
- 使更多类的成员变量就地构造.
- 编译期生成分割线.
- 对部分常量进行限制.
- 构建系统支持添加第三方库.
- 构建系统支持直接打包 release 构建.
- 编译 `manifest-<arch>.o` 时指定编码为 UTF-8.
- 编译时移除符号表.
- 链接时精简 sections.
- 统一使用 GBK 文本编码.
- 移除多余的锁定控制台操作.

</details>
