# M04 (E 组) 实验分析

- 样本数: 10
- 判定 TEST (非等价): 8
- 判定 EQUIVALENT (等价): 2
- 其中已验证生成杀死测试 (原过/异挂): 8
- 模型: deepseek-flash
- 开始: 2026-11-22T10:49:13.165Z
- 结束: 2026-11-22T11:20:27.304Z

## 方法
对每个变异体做一次 LLM 判断（原始代码 + 变异代码 + 上下文）：EQUIVALENT 或 TEST。
判定 TEST 时，复用官方 LLMutantKiller 的差分执行流水线生成并验证一个真实杀死测试
（原程序 PASS、变异程序 FAIL），作为非等价的铁证。详见 predictions.jsonl / mutant_summary.csv。

## 杀死测试证据
每个 TEST 样本的完整证据见 artifacts/<project>/<shortId>/attempt_<n>/successful/：
testCase.test.ts（测试代码）、main_log.txt（原程序 PASS）、mutated_log.txt（变异程序 FAIL）、
meta_report.json（attempt / token / 时间）、prompt_<n>.txt 与 chatHistory.json。

## 提交说明（M04 / E 组）
- 本目录为 10 个样本的冒烟结果（focus100.json 的前 10 项，均为 Complex.js），非完整 100 样本交付。
- reports/ 按官方批次时间戳分子目录保留原始报告；artifacts/ 按 <project>/<shortId>/attempt_<n>/<category>/ 组织原始证据。
- gold_label 列留空（提交锁定前不参与准确性计算）。
- 日志与 prompt 中出现的 D:\桌面\... 为官方工具运行时写入的本地路径，属原始产物、未作改动；不含任何密钥。
