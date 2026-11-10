# DeepSeek 单样本 smoke test

本次只验证模型生成及测试执行流程，不代表完整论文复现，也不纳入 A–E 组正式结果。

- 第一次调用：输出目录位于 Jest 搜索根目录之外，日志显示 No tests found。工具记录为 fail_fail_on_original，但这是环境路径错误，不能用于判断测试效果。耗时 59 秒，输入 1822、输出 311 tokens。
- 第二次调用：输出目录改到 source-code/generated_tests 下，原程序及变异程序各通过 1 项测试，分类 fail_pass_on_mutation，未杀死变异体。耗时 46 秒，输入 1826、输出 300 tokens。ts-jest 对未使用的导入发出警告。
- 两次均为独立付费调用，原始 reports 与 artifacts 分别保存在 01-path-error 和 02-smoke。费用未由工具直接记录。路径为本机运行时路径，迁移后需调整。
- 本次在 Windows Node 24 运行；官方 Node 20 Linux 容器未构建成功。运行器仅增加显式关闭 DeepSeek 思考模式的请求参数，见 run_config.json。
