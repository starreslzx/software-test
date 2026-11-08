# software-test
# LLMutantKiller 论文复现与探索实验

本仓库保存统一样本、各组实验原始产物、调用记录、变异体级汇总和最终图表。字段设计以官方仓库的 `source-code/README.md` 中的输出结构为基础，并增加本小组对照实验所需字段。

官方仓库：<https://github.com/neu-se/LLMutantKiller___Artifact>

## 1. 成员与实验组

| 成员 | 负责实验 | 内容 |
|---|---|---|
| M01 | C | 详细反馈：最多 10 次，保留对话历史，反馈具体失败类别和执行信息 |
| M02 | A、B | A：单次生成；B：最多 10 次独立生成，每次新对话，不提供之前的失败信息 |
| M03 | D | 简单反馈：最多 10 次，保留对话历史，只提示未达到要求，不提供具体错误类别和日志 |
| M04 | E | 对每个变异体二选一：输出“等价”，或提交能够杀死该变异体的测试用例 |
| M05、M06 | 论文整理与汇报 | 不要求运行正式复现实验；负责论文内容、数据汇总、图表和汇报材料 |

所有实验成员统一使用 `data/focus30.json`。不得自行修改样本 ID。

## 2. 实验组定义与统一规则

| 组别 | 初始输入 | 后续交互 | 次数 |
|---|---|---|---:|
| A | 与 B 相同的初始 Prompt | 无 | 1 |
| B | 与 A 相同的初始 Prompt | 每次新对话；不传入之前的回答、测试或执行结果 | 最多 10 |
| C | 与 A 相同的初始 Prompt | 保留对话历史，反馈具体失败类别/执行信息 | 最多 10 |
| D | 与 A 相同的初始 Prompt | 保留对话历史，只反馈“未达到要求，请重试” | 最多 10 |
| E | 原始代码、变异代码及必要上下文 | 输出 `EQUIVALENT` 或 `TEST`；`TEST` 必须附测试文件 | 每个样本一次判断，可按方案执行测试 |

统一控制：
- 固定模型完整 ID、API 路由、temperature、超时、项目代码版本、样本文件和测试验证规则。
- A 组直接复用 B 组每个样本的第一次生成结果，不额外调用模型。
- B 组不强制每次生成不同答案；每次调用必须是独立新对话。
- C、D 组成功后停止，最多 10 次。
- 全部实验只做一轮。API 网络重试次数单独记录，不算作新的模型生成轮次。
- 关闭 LLMutantKiller 的结果工件缓存（`--caching false`），避免读取旧结果。该设置与 OpenRouter/模型服务端的 Prompt 缓存不是同一个功能；服务端缓存设置也必须在各组保持一致并记录。
- 30 个样本为精选诊断样本，不是随机总体样本。A～D 的杀死率按官方标签中的非等价样本计算；等价样本单独报告。

## 3. 仓库目录

```text
.
├── README.md
├── data/
│   ├── focus30.json                 # 全组唯一的样本过滤文件
│   └── sample_manifest.csv          # 样本编号、项目、完整 mutant ID
├── docs/
│   └── experiment_protocol.md       # 实验操作说明
├── submissions/
│   ├── M01/C/
│   ├── M02/A_B/
│   ├── M03/D/
│   └── M04/E/
├── evaluation/
│   ├── gold_labels.csv              # 官方标签；E 组提交前限制访问
│   ├── calls.csv                    # 汇总后的逐次调用记录
│   ├── mutant_summary.csv           # 每个组、每个变异体一行
│   └── comparison.csv               # 组级汇总指标
├── figures/
└── final_presentation/
```

每个实验目录按以下结构提交：

```text
<group>/
├── run_config.json
├── calls.csv
├── mutant_summary.csv
└── artifacts/
    └── <project>/<mutantShortId>/attempt_<n>/<category>/
        ├── chatHistory.json
        ├── prompt_<n>.txt
        ├── testCase.test.ts
        ├── main_log.txt
        ├── mutated_log.txt
        └── meta_report.json
```

文件按实际产生情况保存；例如 `mutated_log.txt` 在官方工具中只会出现在 `successful` 和 `fail_pass_on_mutation` 类别。不得为了凑齐目录而伪造文件。

## 4. 官方工具原始产物：必须保留

官方工具默认输出到 `generated_tests/`，目录层级如下：

```text
<outDir>/<model>/temp_<temperature>/<withTests|withoutTests>/<timestamp>/
├── artifacts/<project>/attempt_<n>/<category>/<mutantShortId>/
└── reports/
    ├── attempt_1.csv
    ├── attempt_2.csv
    ├── errors.json
    ├── report.json
    ├── summary.csv
    └── summary.txt
```

每个 attempt 的官方产物含义：
- `chatHistory.json`：截至该次尝试的完整对话历史。
- `prompt_<n>.txt`：该次发送给模型的渲染后 Prompt。
- `testCase.test.ts`：模型生成的 Jest 测试。
- `main_log.txt`：测试在原始程序上的执行日志。
- `mutated_log.txt`：测试在变异程序上的执行日志；并非每种类别都会生成。
- `meta_report.json`：该次记录的项目、短 mutant ID、attempt、category、耗时、Token 数及 artifact 地址。
- `reports/report.json`：按项目、attempt、category、mutant 汇总的结构化结果。
- `reports/summary.csv`、`summary.txt`：项目级汇总，不是逐变异体明细。
- `reports/attempt_<n>.csv`：第 n 次尝试的项目级汇总。
- `reports/errors.json`：项目级错误信息。

**提交要求：** 保留完整 `reports/` 和对应 `artifacts/`。不能只提交 `summary.csv`，因为它是项目级汇总，无法替代逐变异体记录。

官方类别名称必须原样保留：
- `fail_syntax_error`
- `fail_forbidden_libraries`
- `fail_fail_on_original`
- `fail_pass_on_mutation`
- `successful`

其中 `successful` 只表示自动差分执行通过：测试在原程序通过、在变异程序失败；还需人工检查是否属于外部可观察行为上的有效测试。

## 5. 统一配置文件：run_config.json

每个实验组每次运行保存一份，字段固定如下：

```json
{
  "experiment_id": "C-2026-01",
  "member": "M01",
  "group": "C",
  "model_id": "填写实际模型完整ID",
  "provider": "OpenRouter",
  "api_endpoint": "填写实际接口地址，不含密钥",
  "temperature": 0.5,
  "max_attempts": 10,
  "timeout_seconds": 300,
  "with_tests": false,
  "feedback_mode": "detailed",
  "conversation_mode": "carry_history",
  "artifact_cache_enabled": false,
  "provider_prompt_cache": "enabled/disabled/unknown",
  "network_retries": 3,
  "rate_limit": "adaptive",
  "sample_file": "data/focus30.json",
  "sample_sha256": "填写文件SHA-256",
  "runner_commit": "填写官方仓库代码commit",
  "subject_revisions": "填写subject仓库版本或commit记录路径",
  "started_at": "填写ISO-8601时间",
  "finished_at": "填写ISO-8601时间"
}
```

字段要求：
- `model_id` 必须填写实际模型 ID，不能只写 DeepSeek。
- `feedback_mode` 填 `none`、`detailed` 或 `simple`。
- `conversation_mode` 填 `fresh_each_attempt` 或 `carry_history`。
- `artifact_cache_enabled` 对正式实验统一为 `false`。
- `provider_prompt_cache` 单独记录；它不等于工具的 `--caching`。
- `subject_revisions` 记录 30 个样本对应项目的代码版本；可填写版本清单文件路径。

## 6. 统一调用记录：calls.csv

**一行代表一次模型生成/判断请求，不是一整个变异体。** 字段固定如下：

```csv
experiment_id,member,group,sample_id,project,mutant_id,mutant_short_id,attempt,category,model_id,temperature,elapsed_seconds,tokens_in,tokens_out,uncached_tokens_in,cache_write_tokens,cached_tokens,openrouter_cost_usd,api_retry_count,request_status,error_message,address
```

字段说明：
- `experiment_id`：本次实验运行编号。
- `member`、`group`：成员编号、实验组 A/B/C/D/E。
- `sample_id`、`project`、`mutant_id`：样本编号、项目名、完整变异体 ID。
- `mutant_short_id`：官方输出目录使用的短 ID。
- `attempt`：模型生成轮次；网络重试不增加该值。
- `category`：官方五种结果类别之一；E 组判断请求可填 `E_DECISION`，未产生结果填 `no_result`。
- `model_id`、`temperature`：实际模型完整 ID 和温度。
- `elapsed_seconds`：该次 attempt 耗时，对应官方 `meta_report.json` 的 `elapsedSeconds`。
- `tokens_in`、`tokens_out`：对应官方 `meta_report.json` 的 `tokensIn`、`tokensOut`。
- `uncached_tokens_in`、`cache_write_tokens`、`cached_tokens`：若原始报告提供则填写；没有则留空，不填 0。
- `openrouter_cost_usd`：若 API/报告返回该次调用费用则填写；没有直接费用字段则留空，另按 Token 和当日价格估算，不得伪装成 API 实测费用。
- `api_retry_count`：本次请求发生的网络/API 重试次数。
- `request_status`：`success`、`api_error`、`timeout`、`parse_error`。
- `error_message`：失败原因；无错误留空。
- `address`：对应官方 `meta_report.json` 的 artifact 地址/相对路径。

官方 `meta_report.json` 的字段名为 `project`、`mutationShortId`、`attempt`、`category`、`elapsedSeconds`、`tokensIn`、`tokensOut`、`address`。如有缓存计量，还可能出现 `uncachedTokensIn`、`cacheWriteTokens`、`cachedTokens`、`openRouterCost`。汇总时保留这些原始字段，并映射到本表字段。

## 7. 统一变异体汇总：mutant_summary.csv

**一行代表一个实验组中的一个变异体。** 字段固定如下：

```csv
experiment_id,member,group,sample_id,project,mutant_id,gold_label,attempts_used,first_success_attempt,final_category,auto_killed,valid_kill,invalid_kill_only,e_group_decision,test_file,original_result,mutated_result,input_tokens_total,output_tokens_total,cost_usd_total,elapsed_seconds_total,api_error_count,notes
```

字段说明：
- `gold_label`：官方人工标签 `EQUIVALENT` 或 `NON_EQUIVALENT`。E 组提交预测前不得向 M04 或模型公开。
- `attempts_used`：实际模型生成/判断次数，不含网络重试。
- `first_success_attempt`：首次出现 `successful` 的轮次；没有则留空。
- `final_category`：该变异体最终有效 attempt 的官方类别；若从未产生结果填 `no_result`。
- `auto_killed`：是否出现官方 `successful`。
- `valid_kill`：经人工检查是否为行为有效的杀死测试，填 `true`、`false` 或 `unknown`。
- `invalid_kill_only`：是否只被行为无效测试自动杀死。
- `e_group_decision`：仅 E 组填写 `EQUIVALENT` 或 `TEST`。
- `test_file`：E 组选择 `TEST` 时填写提交的测试文件路径。
- `original_result`、`mutated_result`：填写 `PASS`、`FAIL`、`NOT_RUN` 或 `ERROR`。
- `input_tokens_total`、`output_tokens_total`、`cost_usd_total`、`elapsed_seconds_total`：该变异体所有实际模型调用的累计值。
- `api_error_count`：网络/API 错误次数。
- `notes`：人工复核意见、环境问题或其他说明。

注意：等价变异体不能计入 A～D 的有效杀死率分母；自动 `successful` 不等于人工确认的 `valid_kill=true`。

## 8. E 组专用输出格式

M04 对每个变异体只提交一个最终决策，不要求解释“等价”的理由。使用 `predictions.jsonl`，每行一个 JSON 对象。

判断为等价：

```json
{"sample_id":"M001","mutant_id":"完整ID","decision":"EQUIVALENT"}
```

判断为非等价并提供测试：

```json
{"sample_id":"M002","mutant_id":"完整ID","decision":"TEST","test_file":"tests/M002.test.js"}
```

规则：
- `decision` 只能是 `EQUIVALENT` 或 `TEST`。
- `TEST` 必须提供真实存在的测试文件。
- 测试必须在原程序通过、在对应变异程序失败，并检查外部可观察行为，才记为有效。
- 输出无法解析、缺少测试文件或测试无效，分别记录为 `parse_error`、`missing_test`、`invalid_test`；不得人工改写模型原始决策。
- E 组提交并锁定 `predictions.jsonl` 后，才允许用 `gold_label` 计算准确性。

## 9. 统一汇总字段：comparison.csv

每个实验组一行，至少包含：

```csv
group,total_samples,non_equivalent_samples,equivalent_samples,auto_killed_non_equivalent,valid_killed_non_equivalent,invalid_kill_only,valid_kill_rate,mean_attempts_per_sample,total_tokens_in,total_tokens_out,total_cost_usd,total_elapsed_seconds,api_error_count
```

计算规则：
- `valid_kill_rate = valid_killed_non_equivalent / non_equivalent_samples`。
- A～D 的主要比较只看非等价样本的 `valid_kill_rate`；等价样本单独报告误杀/无效测试。
- E 组另报告等价识别准确数、非等价样本中有效测试数、格式错误数；不要把 E 组决策准确率与 A～D 杀死率混为一个指标。
- 所有费用均以 USD 记录；实测费用与按 Token 价格估算的费用必须区分。

## 10. 提交规范

每位实验成员提交到自己的目录，至少包含：
1. `run_config.json`
2. 官方原始 `reports/` 目录
3. 对应 `artifacts/` 目录（Prompt、chatHistory、测试代码、原/变异执行日志、meta_report）
4. 填好的 `calls.csv`
5. 填好的 `mutant_summary.csv`
6. 简短 `analysis.md`：说明成功数、失败数、典型案例和异常情况

提交前检查：
- 30 个样本 ID 与 `data/focus30.json` 完全一致。
- 没有删除失败样本；未运行/报错也要记录。
- Token 和费用只累计实际调用，不要把 `report.json` 中累计数据重复相加。
- 不提交 `.env`、API Key、密码、`node_modules/`、缓存或临时文件。
- 使用分支 `member/M01`～`member/M06`，通过 Pull Request 合并。
