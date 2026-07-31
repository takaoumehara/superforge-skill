# Legal Triggers — what the product's behaviour obliges you to answer

## 0. What this file is, and what it is deliberately not

**It is** a map from *what the product does* to *which questions you now owe an
answer to*, and to the point where a professional has to take over.

**It is not** legal advice, and it contains no legal text on purpose. It will
not draft a privacy policy, quote a statute, or tell you that you are compliant.
Two reasons, both practical:

1. **Rules change and text goes stale.** A frozen paragraph of legal wording in
   a repository becomes wrong silently, and wrong-with-confidence is worse than
   absent. Every entry below is a prompt to **verify the current requirement**,
   not a statement of it.
2. **Generated legal documents describe the wrong product.** A template filled
   in from memory produces a policy about someone else's data practices. Getting
   the *facts* right — §1 — is the part that has to happen first and the part
   that is actually yours to do.

Above the lines in §7, this file stops and hands over. That is the design, not
a limitation.

---

## 1. The structural fact that makes this checkable

> **Obligations follow your users, not your address.**

A developer in New York, in Tokyo, or anywhere else faces the same set,
determined by **where the people using the product are** and **what data is
touched**. 「自分は日本にいるから」 and 「うちは EU に進出していないから」 are
not answers to anything — an app on a global store reaches EU users on day one
unless it is deliberately region-locked.

This is also what makes the rest of this file usable by anyone, anywhere: the
inputs are the product's own behaviour and its actual user base, both of which
you can check.

---

## 2. Step one — what does it actually touch

Build this from **the code and its dependencies**, never from memory. The
inventory is the foundation; everything downstream is wrong if this is.

| Category | Commonly forgotten |
|---|---|
| **Identifiers** | IP address, advertising ID, device fingerprint, session ID. **These are treated as personal data in many jurisdictions**, which surprises people who assumed "we don't collect personal information" because there is no name field |
| **Account data** | Email, display name, profile photo, the login provider's returned payload — often more than you asked for |
| **User content** | Anything uploaded, typed, or recorded. Also the *derived* data: thumbnails, transcripts, embeddings, model outputs |
| **Usage / analytics** | Screen views, feature usage, timestamps. Personal once tied to any identifier above |
| **Diagnostics** | Crash logs — which frequently contain user content in a stack trace or a screenshot |
| **Device & environment** | OS version, model, locale, timezone, network. Individually mundane, collectively a fingerprint |
| **Location** | Precise vs. coarse are treated very differently. IP-derived location still counts |
| **Third-party SDKs** | **Every SDK that transmits anything is your collection, disclosed under your name.** Analytics, ads, crash reporting, push, payments, auth, maps, fonts loaded from a CDN |
| **Model / AI providers** | What is sent to an inference API, whether it is retained, and whether it may be used for training. This is a disclosure item and often a contractual one |

**The most common false statement in a privacy policy** is "we do not collect
personal information," written by someone who did not count the analytics SDK,
the crash reporter, and the IP addresses in their server logs.

---

## 3. Step two — where are the users, and what does that switch on

Regimes differ in detail and converge in shape. The detail is what changes and
what needs verifying; the shape is stable enough to build against.

| Region | Fires when | Named regime(s) |
|---|---|---|
| **EU / EEA, UK** | **One user is enough** if the product is offered to them. No revenue or size threshold | GDPR, UK GDPR |
| **California** | Statutory thresholds exist (revenue / volume) that most individual makers fall under — but the platform and browser expectations apply regardless | CCPA / CPRA |
| **Other US states** | A growing patchwork with broadly similar duties; thresholds vary | state privacy acts |
| **Japan** | Handling personal information of people in Japan; cross-border transfer has its own requirements | 個人情報保護法（APPI） |
| **Canada, Brazil, South Korea, India, others** | Same trigger logic — users present, data touched | PIPEDA, LGPD, PIPA, DPDP, … |

### The universal baseline

Almost every regime above demands the same four things in some form. **Build
these four from the start and you are broadly aligned nearly everywhere**, which
is the practical answer to "my users could be anywhere":

1. **Tell them** — an accessible, accurate notice of what is collected, why, and
   who else receives it.
2. **Limit it** — collect for a stated purpose, and do not quietly reuse it for
   another one later.
3. **Let them out** — a real path to access and delete their data, reachable in
   the product rather than only by email.
4. **Be reachable** — a working contact route for privacy questions, answered
   by a human.

Everything jurisdiction-specific is a variation on those four: which legal basis
you must state, how fast you must respond, what a cross-border transfer requires,
what the opt-out must be called. **Get the four right, then verify the local
variations for the markets you actually have users in** — in that order, because
the four are the expensive part to retrofit and the variations are not.

---

## 4. Escalation — categories that change the rules

The moment any of these is involved, the baseline is no longer enough, and §7
applies before anything else:

- **Health, medical, mental health, fitness data that implies a condition**
- **Biometric identification** — face, fingerprint, voiceprint, gait
- **Precise location**, especially continuous or background
- **Financial account data, payments held on behalf of others**
- **Children** — see §5
- **Race, religion, political opinion, union membership, sexual orientation**
- **Contents of private communications**

These are not "be more careful" categories. They frequently carry separate
consent requirements, separate retention rules, separate breach obligations, and
substantially larger consequences for getting it wrong.

---

## 5. Children — the rules apply by appeal, not by intention

- **Under 13 in the US** has its own regime with parental-consent requirements.
- **In the EU, the digital consent age varies by member state** (a range, not a
  single number), so "13 is fine" is not portable.
- **App stores enforce their own age-rating and kids-category rules**, which are
  stricter than the law in places — particularly around advertising and
  third-party analytics in children's apps.
- **Intent is not the test.** If the product is *likely to appeal* to children —
  the art style, the subject, the way it is marketed — the rules can apply even
  though you built it for adults.

If children are a real audience rather than an edge case, this is a §7 stop.

---

## 6. Money — disclosure obligations that are not about privacy

| Situation | What must be true |
|---|---|
| **Auto-renewing subscription** | Price, billing period, renewal behaviour, and how to cancel are all visible **before** purchase — platform rules and consumer law both require this, and paywalls routinely fail it |
| **Free trial converting to paid** | The conversion date and amount are stated plainly, before the trial starts |
| **Cancellation** | Cancelling must not be materially harder than subscribing. Several jurisdictions now treat obstruction as an offence in itself |
| **Selling directly to consumers in Japan** | 特定商取引法に基づく表記 is required on your own checkout — seller identity, contact, price, delivery and refund terms |
| **Selling to EU consumers** | Digital goods carry a withdrawal right with specific mechanics for waiving it at purchase |
| **Sales tax / VAT / consumption tax on digital services** | Determined by the buyer's location, not yours. **This is an accountant's question, not a lawyer's** — but it is a launch question, and stores handle only part of it |

The first three connect straight back to
`superforge-biz/references/behavioral-frameworks.md`: the tactics listed there
as 「よく勧められるが、ここでは使わない」 — opt-out billing, hidden cancellation —
are not only trust problems. In several jurisdictions they are the regulated
conduct.

---

## 7. Stop conditions — where this file hands over

Below these lines, careful work and this checklist are reasonable. **At or above
them, get professional advice before shipping.** Not "consider getting" — this
is the boundary the skill is built around.

- Health, medical, or clinical data, or any claim about a health outcome
- Financial services, lending, or holding money on behalf of users
- Children as an intended or likely audience
- Biometric identification of individuals
- Anything where being wrong ends the business rather than costing money
- Employment, hiring decisions, or algorithmic assessment of people
- Training on, or redistributing, someone else's content or dataset
- Raising money, or any agreement with revenue share or equity
- **You have received an actual complaint, takedown, or regulator contact** —
  stop and get advice before replying. The first reply matters more than
  anything you will write afterwards

An AI, this file included, is a reasonable way to find out **which** of these
you are in. It is not a reasonable way to handle being in one.

---

## 8. Accessibility can be a legal gate, not only a quality one

Depending on the market, the sector, and the size of the business, accessibility
obligations may apply to consumer digital products and services — the European
Accessibility Act's scope and dates, public-sector procurement rules in the US,
and Japan's obligations around reasonable accommodation are all live examples.
Web accessibility litigation is an established pattern in the US independent of
any specific statute.

Verify what applies to your market and category. **`superforge-a11y`** owns the
criteria and the ledger — this file only records that a legal exposure exists
where the audit has not been run. Route there rather than restating anything.

---

## 9. The staleness rule

Everything above is a pointer with a shelf life. Regimes change, thresholds
move, new state and national laws arrive continuously, and platform rules change
more often than laws do.

**Record the date of the check in `docs/ship-readiness.md`**, and treat a check
older than the current release as not done. A compliance section with no date is
the same failure mode as an undated market figure in
`superforge-biz/references/market-sizing.md`: a D-tier assumption wearing a
B-tier costume.

---

## Output

Into `docs/ship-readiness.md`:

```markdown
## Data the product touches
| データ | どこから（コード/SDK名） | 誰に渡るか | 保持期間 |

## Legal triggers
| 法域/規則 | 発火したか | 根拠（どのデータ・どのユーザー） | 対応状況 | 確認日 |

## Universal baseline
通知 <済/未> · 目的限定 <済/未> · 削除経路（製品内） <済/未> · 連絡先 <済/未>

## Escalation categories present
<§4 に該当するものがあれば列挙。無ければ「なし」と明記する>

## Stop conditions
<§7 に該当するか。該当するなら、専門家に確認済みかどうか>
```
