# Surface and Scope — the two questions before any design decision

`references/design-sourcing.md` answers *where the look comes from*.
`references/aesthetic-direction.md` answers *what direction to commit to*.
Neither answers the two questions that come before both, and getting either
wrong makes the rest of the process solve the wrong problem well:

1. **What does success look like on this surface?**
2. **Am I preserving something, or replacing it?**

Both are cheap to answer and expensive to get wrong, because both are decided
implicitly if they are not decided explicitly.

---

## 1. The mode — what the visitor is here to do

A page is not designed for a product. It is designed for **one surface of that
product**, and different surfaces of the same product want opposite things.

| Mode | The visitor succeeds when | Optimise for | Legitimately sacrifice |
|---|---|---|---|
| **Persuade** | They decide and act | Attention, a clear claim, one action. Here **the design is the product** | Density, speed of repeat use |
| **Operate** | They finish a task | Scanability, consistency, native expectations, the real usage scene | Expression, novelty, first-impression drama |
| **Read** | They understand something | Structure that survives skimming, then a reading experience worth staying in | Conversion mechanics, interaction |
| **Experience** | They are inside the work itself | The artifact leading from the first viewport; the interface receding | Wayfinding conventions, information density |

**Take the mode from the surface in front of you, not from what the company
sells.** The marketing page of a developer tool is Persuade. The reference
manual of a fashion house is Read. The contents page of a manual is still Read
— it wants you further in, but it earns that by being navigable, not by
selling. Reverse this and you get the two failures every category produces: an
application built like a brochure, and a brochure built like an application.

**One product will hold several modes, and they may look different on purpose.**
Shared tokens, different density, different amount of motion, different tone.
Forcing one visual treatment across all four is how a beautiful marketing site
becomes an exhausting app.

**The sacrifice column is the useful half.** A mode that gives up nothing is not
a mode, it is a wish. If Operate work is being asked to also be visually
striking above all else, that tension is real and belongs in the artifact, not
buried in the execution.

---

## 2. Refinement or redesign — and never the middle

The second question, and the one that quietly wastes the most work.

|  | **Refinement** | **Redesign** |
|---|---|---|
| Keeps | The identity, the behaviour, the copy, and **everything outside the stated scope** | Product truth, content, function, native affordances, constraints |
| Treats the current look as | The thing being improved | **Evidence and anti-reference** — proof of what was tried |
| Ends with | The same world, executed better | A different world, chosen deliberately |
| Ask before | Replacing factual copy or adding a claim | Nothing about the look; everything about the truth |

> **Never split the difference.** Polish applied to a look you have already
> decided to discard is the most wasted work in this whole process — it costs
> real hours, it makes the discarded version harder to abandon, and it produces
> a result that is neither the old thing done well nor the new thing.

**How to tell which one you are in:** ask what happens to the parts you were not
asked about. If they must survive untouched, it is refinement. If they are
allowed to change because the world changed, it is redesign. **A request to
"make it feel more premium" is usually a redesign wearing refinement's
clothes** — say so before starting, because the two have very different costs.

**A third case exists and neither row covers it:** the scope is a single
component or one fragment inside a settled system. That is neither — it is
conformance work, and the only question is whether the fragment matches the
system it lives in (`references/design-system-output.md`). Do not open a
direction conversation for a fragment.

---

## 3. A missing design file does not mean greenfield

**Visual authority is evidence, not a filename.** A project with no
`docs/design.md` still has an implicit system — in its CSS, its components, its
existing screens. That system is real, it was chosen by someone, and users have
already learned it.

So the absence of documentation is a reason to **extract** (`design-sourcing.md`
§5), not a licence to replace. The decision to replace is made on the merits,
after looking, and it is announced.

---

## 4. The brief outranks your taste

When the user has pinned something — an era, a material, a font, a palette, a
reference they love — **that is the direction**, including when it collides with
a warning in `aesthetic-direction.md` §3 or a floor in
`references/build-floor.md`.

> **Steering a clear brief toward your own preference is a failure, not a
> service** — and it is a failure that is easy to commit while feeling helpful.

Say the concern once, in one sentence, with the specific cost. Then build what
was asked. "Uppercase eyebrows on every section will read as a template" is
useful; quietly not doing it and delivering something else is not.

The exception is not taste. It is fact: accessibility below the legal floor
(`superforge-a11y`), a claim that is not true (`superforge-verify` §5), or
something that would not ship (`superforge-ship`). Those are not preferences and
they do not yield to a brief.

---

## 5. What lands in the artifact

At the top of `docs/design.md`, above the Design DNA block:

```markdown
## Surface
Mode: Persuade / Operate / Read / Experience — and one line on why this surface
Sacrificing: <what this mode gives up, stated on purpose>
Scope: refinement / redesign / fragment
Out of scope: <what must survive untouched>
Pinned by the brief: <anything the user fixed — these outrank every default>
```

**Record the mode per surface, not per project.** The next screen may be a
different mode, and a project-level mode is how a product ends up with one
treatment stretched over four different jobs.

---

## Before opening a design tool

- [ ] The mode is named, and so is what it gives up
- [ ] The mode came from the surface, not from the company or the category
- [ ] Refinement / redesign / fragment is decided, and stated
- [ ] If refinement: what must survive untouched is written down
- [ ] If redesign: the old look is being read as evidence, not polished
- [ ] Nothing is being polished that has already been decided against
- [ ] Anything the brief pinned is recorded, and it outranks every default here
