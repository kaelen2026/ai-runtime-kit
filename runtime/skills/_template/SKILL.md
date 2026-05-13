<!--
  Skill template. Copy this file to
  `.ai/runtime/skills/<stack-or-domain>/<skill-name>/SKILL.md` and
  fill it in.

  The YAML frontmatter below is DECLARATIVE: no runtime tool reads or
  enforces it. Agents read it during context-loading to judge whether
  this skill applies. See `.ai/runtime/skills/README.md` § "How
  skills get loaded" for the three loading paths.
-->
---
name: <skill-name-kebab-case>
description: <one sentence: when this skill applies and what it produces>
metadata:
  priority: <1-10, higher = stronger trigger>
  pathPatterns:
    - "<glob: e.g. src/**/*.ts>"
  bashPatterns:
    - "<regex: e.g. \\bnpm\\s+run\\s+build\\b>"
  promptSignals:
    phrases:
      - "<exact phrase the user is likely to say>"
    anyOf:
      - "<keyword>"
    minScore: <integer, e.g. 6>
---

# <Skill Name>

<One paragraph describing what the agent should do when this skill is loaded.>

## 目标

- <deliverable 1>
- <deliverable 2>

## 输入 / 输出

- **输入**：<source materials — files, user description, contracts>
- **输出**：<destination — file path convention or report shape>

## 工作方式

1. <step 1>
2. <step 2>
3. <step 3>

## 推荐输出结构

```md
<scaffold for the produced artifact>
```

## 约束

- <constraint 1>
- <constraint 2>

## 完成标准

<what "done" looks like — checkable criteria>
