---
layout: ../../layouts/ArticleLayout.astro
title: "Sigma rules that actually survive a noisy SOC"
description: "Tuning detection logic against real telemetry instead of lab traffic — with false-positive budgets."
pubDate: 2026-08-28
category: "Defensive Ops"
tags: ["sigma", "detection", "soc"]
---

A rule that fires forty times a shift gets disabled by the third on-call rotation. **A detection you cannot afford to
keep enabled is not a detection.** Give every rule a false-positive budget before you ship it.

## The budget

| Severity | Alerts per week | Owner |
| --- | --- | --- |
| Critical | ≤ 2 | on-call |
| High | ≤ 10 | detection eng |
| Medium | ≤ 40 | weekly triage |

## Tuning loop

1. Write the rule against last month's real telemetry, not lab traffic
2. Measure hits before enabling any paging
3. Narrow with environment-specific allowlists, never by raising severity thresholds
4. Re-measure monthly — infrastructure drifts under you

```bash
sigma convert -t splunk rules/proc_creation_susp_curl_pipe_sh.yml \
  | tee /tmp/query.spl
```
