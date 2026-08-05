# AI & Generative Search Discoverability Standards (AEO & GEO Engine)

Modern web products must be discoverable not only by traditional search indexing engines (Google, Bing) but also by AI Search Agents & Generative Engines (Perplexity, SearchGPT, ChatGPT, Claude, Gemini).

---

## The 4 Pass Audit: Pass 4 — AI Discoverability (AEO/GEO)

### 1. `llms.txt` & `llms-full.txt` Generation
Generate machine-readable summaries for AI crawlers in the root directory:
- **`llms.txt`**: Standard lightweight Markdown file containing product title, core value proposition, key architecture links, and primary API/documentation entrypoints.
- **`llms-full.txt`**: Expanded complete Markdown documentation for deep AI ingestion.

#### Format Standard for `llms.txt`:
```markdown
# [Product Name]

> [One-sentence value proposition]

## Overview
[Concise 2-paragraph summary of what the product does, key technical architecture, and primary audience.]

## Core Features & Concepts
- [Feature 1]: [Explanation]
- [Feature 2]: [Explanation]

## Key Links & Resources
- [Documentation](https://example.com/docs): Full product guide
- [API Reference](https://example.com/api): API endpoints
```

---

## 2. Structured Data (Schema.org / JSON-LD) Verification
Every public landing page or documentation surface must include valid JSON-LD:
- **SoftwareApplication** or **WebApplication** schema for apps.
- **Organization** or **Product** schema.
- **FAQPage** schema where applicable to feed direct generative answer snippets.

---

## 3. Generative Citation & Fact Density Audit
AI engines prioritize content with high fact-density over generic marketing fluff.
- **Fact-Density Check**: Are quantitative statistics, API parameters, or explicit technical specs present?
- **Entity Resolution**: Are key product concepts defined unambiguously using explicit headings (`h2`, `h3`) and descriptive anchors?
