---
layout: ../../layouts/ArticleLayout.astro
title: "Rolling your own nonce: a post-mortem in AES-GCM misuse"
description: "Counter reuse across three microservices, and the forgery it handed us for free."
pubDate: 2026-09-02
category: "Crypto"
tags: ["aes-gcm", "post-mortem"]
---

Three services shared a key and each maintained its own counter. Two of them restarted from zero on deploy, so the
same `(key, nonce)` pair encrypted different plaintexts — **which leaks the authentication key, not just the
keystream**.

## What went wrong

1. A 64-bit counter persisted in memory only
2. No per-service nonce prefix
3. No alerting on duplicate nonces in the audit log

## The fix

```go
// 4-byte service prefix + 8-byte monotonic counter, persisted before use.
nonce := make([]byte, 12)
copy(nonce[:4], servicePrefix)
binary.BigEndian.PutUint64(nonce[4:], counter.Next())
```

Random 96-bit nonces would also have been fine here. Deterministic counters are only safe when the counter itself is
durable.
