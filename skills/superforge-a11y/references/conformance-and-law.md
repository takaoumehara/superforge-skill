# Conformance and the Standards That Reference It

Which version applies, what a claim actually requires, and how to say what you
found without saying something untrue.

**This is engineering guidance for scoping an audit, not legal advice.** When a
deadline or a penalty is in play, the answer comes from counsel in the relevant
jurisdiction, not from this file.

---

## Which WCAG version

| Version | Status | Where it is required |
|---|---|---|
| **WCAG 2.0** (2008) | superseded, still referenced | JIS X 8341-3:2016; older contracts |
| **WCAG 2.1** (2018) | current legal baseline in most regimes | EN 301 549 / EAA; ADA Title II final rule; Section 508 in practice |
| **WCAG 2.2** (Oct 2023) | current W3C Recommendation | the version to build to |
| **WCAG 3.0** | Working Draft, updated March 2026 (~174 requirements, graded conformance model) | **nothing** — not expected to reach Recommendation before the end of the decade |

**Audit to 2.2 AA.** 2.2 is backwards compatible: content that meets 2.2 AA also
meets 2.1 AA and 2.0 AA, with the single exception that 2.2 dropped 4.1.1
Parsing. So one audit satisfies every regime below, and you are not re-auditing
when a regulation updates its reference.

Anyone quoting WCAG 3.0 as a current requirement is mistaken. Say so plainly and
move on.

---

## The regimes an audit is usually scoped against

### EU — European Accessibility Act (EAA) + EN 301 549

- Applied from **28 June 2025** to new products and services placed on the EU
  market; products and services already offered before that date have a
  transition running to **28 June 2030**, subject to how each member state
  implemented it.
- The digital requirement is **EN 301 549**, which incorporates **WCAG 2.1 AA**.
- Scope is broad and commercial, not just public sector: e-commerce, banking,
  transport, e-books, telecoms, ticketing.
- Enforcement is live — the first EAA actions were filed in France in late 2025,
  with further member-state activity through 2026.
- Microenterprises providing services (under 10 staff and under €2m turnover)
  are generally excluded, but the exclusions are national and narrow. Check,
  do not assume.

### US — ADA Title II (state and local government)

- DOJ final rule published **24 April 2024** adopting **WCAG 2.1 AA** for web
  content and mobile apps.
- Compliance dates were **extended by one year on 17 April 2026**: entities
  serving populations of 50,000+ now have until **26 April 2027**; smaller
  entities and special district governments until **26 April 2028**.
- The standard and the covered scope did not change with the extension — only
  the date.
- Covers cities, counties, school districts, transit agencies, libraries, and
  public universities, plus contractors delivering their services.

### US — Section 508

Federal agencies and their suppliers. References **WCAG 2.0 AA** through the
Revised 508 Standards; procurement increasingly asks for 2.1 or 2.2 and for an
**ACR/VPAT** — a completed conformance report per criterion, which is exactly
the criterion ledger this skill produces.

### US — ADA Title III (private business)

No published technical standard. Courts have overwhelmingly treated **WCAG 2.1
AA** as the reference in practice. Litigation volume, not regulation, is the
driver here.

### Japan — JIS X 8341-3:2016

- Identical in content to WCAG 2.0 / ISO/IEC 40500. Level AA is **25 Level A +
  13 Level AA = 38 criteria** — the WCAG 2.0 counts, which is why the number
  differs from WCAG 2.2's 55.
- Not a legal mandate for private companies, but the 障害者差別解消法 (Act on
  the Elimination of Discrimination against Persons with Disabilities) has made
  reasonable accommodation an obligation for private business since **April
  2024**, and web accessibility is treated as part of that expectation.
- Public bodies work to 総務省「みんなの公共サイト運用ガイドライン」, which
  asks for **AA 準拠** and, importantly, for the **試験結果を公開する** — the
  test result is published, per the WAIC 試験実施ガイドライン. If a Japanese
  public-sector site is in scope, the deliverable is a published test result
  page, not an internal report.

### Canada — AODA / ACA

Ontario's AODA references **WCAG 2.0 AA**; the federal Accessible Canada Act
regime is moving toward EN 301 549. Same conclusion: audit to 2.2 AA.

---

## What a conformance claim actually requires

Five conditions, all of them, before the word "conformant" may be used:

1. **A level** — A, AA, or AAA. Partial conformance to a level is not a thing.
2. **Full pages.** A page conforms or it does not. You cannot exclude the part
   that fails.
3. **Complete processes.** If any step of a multi-step process fails, no page in
   that process conforms. Checkout, sign-up, and booking are the cases that bite.
4. **Accessibility-supported technologies only.** If a feature relies on
   something assistive technology does not support, it does not count toward
   conformance.
5. **Non-interference.** Content that is *outside* the claim must still not
   break the rest of the page — no keyboard traps, no unstoppable audio, no
   flashing. A third-party widget you excluded can still sink the page.

If any of these is not met, the honest words are **"not conformant"** or **"not
assessed"**. There is no defensible middle phrasing, and inventing one is how a
report becomes a liability.

### Third-party content

Use a **statement of partial conformance** when content you do not control
(embedded maps, payment iframes, ad slots, user-generated content) is in the
page. It names what was excluded and why, and it still requires
non-interference. Do not quietly drop the widget from the scan and report green.

---

## The accessibility statement

Required by EN 301 549 for public bodies, expected everywhere else, and the
easiest thing to write once the criterion ledger exists:

- Target standard and level, and the date assessed
- **What does not conform, named specifically**, and why
- The alternative route for anything inaccessible
- A contact for reporting a barrier, and a response commitment
- Assessment method — self-assessment, third-party audit, or both

A statement that says "we are committed to accessibility" and nothing else is
worse than none: it is a claim with no content attached, and it is the first
thing a complaint quotes back.

---

## Scoping shorthand

| The user says | Audit to | Extra deliverable |
|---|---|---|
| nothing about market | WCAG 2.2 AA | — |
| "EU", "we sell in Europe" | 2.2 AA (covers EN 301 549 / 2.1 AA) | accessibility statement |
| "US government", "state agency", "public university" | 2.2 AA (covers Title II / 2.1 AA) | dated remediation plan |
| "federal contract", "we need a VPAT" | 2.2 AA | ACR/VPAT — the ledger, per criterion |
| 「日本の公共サイト」「JIS対応」 | 2.2 AA (exceeds JIS / 2.0 AA) | 試験結果ページ + 対応方針 |
| "we got a demand letter" | 2.2 AA | counsel first, then a dated fix plan |

In every row the audit is the same. Only the paperwork changes — which is the
argument for auditing to 2.2 AA once and never scoping to a lower bar to save
effort.
