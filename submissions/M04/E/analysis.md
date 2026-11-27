# M04 (E 组) 实验分析

- 样本数: 100
- 判定 TEST (非等价): 96
- 判定 EQUIVALENT (等价): 4
- 其中已验证生成杀死测试 (原过/异挂): 96
- 恢复说明: 本结果已通过 artifacts 断点恢复脚本回填，断网/中断不会丢失已验证成功的测试。

## 方法
对每个变异体做一次 LLM 判断（原始代码 + 变异代码 + 上下文）：EQUIVALENT 或 TEST。
判定 TEST 时，复用官方 LLMutantKiller 的差分执行流水线生成并验证一个真实杀死测试
（原程序 PASS、变异程序 FAIL），作为非等价的铁证。

## 提交说明（M04 / E 组）
- 本目录为完整 100 个样本交付（与 data/focus100.json 的 100 个变异体一一对应）：TEST 96 个、EQUIVALENT 4 个，其中 96 个 TEST 已通过官方差分验证（原程序 PASS / 变异程序 FAIL）。
- reports/ 按官方批次时间戳分子目录保留原始报告；artifacts/ 按 <project>/<shortId>/attempt_<n>/<category>/ 组织原始证据。
- gold_label 列留空（提交锁定前不参与准确性计算）。
