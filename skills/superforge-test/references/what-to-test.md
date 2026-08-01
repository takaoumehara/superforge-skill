# What to Test — and what not to

`SKILL.md` has the Red-Green-Refactor loop and the runner command per platform.
Neither tells you **what to point it at**, and that is the decision that
determines whether a test suite is an asset or a tax.

The two failure modes are symmetric and both common: testing everything, which
produces a suite so slow and brittle that people stop running it; and testing
nothing, which produces a codebase nobody dares change. The way out is not
"more discipline" — it is deciding, deliberately, what earns a test.

---

## 1. What earns a test

A test earns its keep when **it would catch a failure that a human would not
notice immediately**. That single criterion resolves most cases.

| Test it | Because |
|---|---|
| **Business rules and calculations** | Wrong by a little, silently, forever. Nobody notices a 3% error in a total |
| **Anything with money, dates, timezones, or units** | The highest bug-per-line density in software, and the failures are quiet |
| **Edge and boundary conditions** | Zero, one, many, empty, maximum, negative, null. This is where bugs actually live |
| **Bug fixes** | A test written at the moment of the fix is the cheapest one you will ever write, and it stops the bug returning |
| **Anything a user cannot recover from** | Data loss, double charges, irreversible sends |
| **Contracts between parts you did not write together** | API shapes, serialisation, database schemas |

| Do not test it | Because |
|---|---|
| **Framework behaviour** | You are testing someone else's library, and it already has tests |
| **Getters, setters, pass-throughs** | Nothing can be wrong |
| **Exact visual appearance** | A screenshot test of a design that is still moving fails daily and teaches everyone to ignore failures |
| **Private internals** | The test breaks on every refactor, which is the opposite of the point |
| **Code you are about to throw away** | A spike does not need a suite |

**The clearest question when unsure:** *if this broke, how would I find out?* If
the answer is "instantly, the app would not start" — a test adds little. If it
is "a customer would tell us next month" — write the test.

---

## 2. Granularity — write the fewest slow tests you can get away with

Cost rises and stability falls as you go up. Push each test as far **down** as
it can go while still proving the thing you care about.

| Level | Proves | Cost | Aim for |
|---|---|---|---|
| **Unit** | One function or rule in isolation | Milliseconds, very stable | Most of the suite. All the branch and boundary cases live here |
| **Integration** | Two or more real parts agreeing — code + database, module + module | Seconds, moderately stable | The seams. Each one written once, not once per case |
| **End-to-end** | A whole user journey through the real system | Slow, the most fragile thing you own | A handful. Only the paths where failure ends the business — sign up, pay, the core action |

**Never write at E2E what a unit test can prove.** Testing a validation rule
through a browser is the same assertion at a hundred times the cost and a
fraction of the reliability.

The number that matters is not coverage. It is **how long the suite takes and
how often it lies.** A suite that runs in seconds and is always right gets run
on every save. One that takes twenty minutes and fails randomly gets skipped,
and a skipped suite is worth zero regardless of what it contains.

---

## 3. Mocking — the line, and why it matters

Mocking replaces a real dependency with a stand-in. Necessary; also the fastest
way to build a suite that passes while the product is broken.

**Mock these:**
- Network calls to third parties (their outage is not your test failure)
- Time, randomness, unique IDs — anything non-deterministic
- Slow or expensive things: payment providers, email, LLM APIs
- Things with side effects you cannot undo

**Do not mock these:**
- **Your own code.** A test where every collaborator is mocked asserts only that
  you wrote the mocks to match your assumptions. It passes when the assumptions
  are wrong, which is exactly when you needed it
- **The database.** Use a real one — a container, a temp file, an in-memory
  instance of the same engine. Mocked persistence is where the worst bugs hide,
  because query behaviour is the thing being got wrong
- **The thing under test**, obviously — but this happens more often than it
  sounds, in the form of mocking a private method to force a branch

**The rule:** mock at the boundary of what you control, never inside it. If a
test needs five mocks to run, that is not a mocking problem — the code has too
many collaborators, and the test is telling you so.

**Every mock is a claim about how the real thing behaves**, and that claim goes
stale silently when the real thing changes. Where the mocked service publishes
one, use a contract test to catch the drift.

---

## 4. Brittle tests — recognise them before they train people to ignore failure

A test that fails for reasons unrelated to a real defect is worse than no test,
because it teaches everyone that red does not mean broken. Once that is learned,
the real failure is skipped too.

| Symptom | Cause | Fix |
|---|---|---|
| Fails at midnight, or on the 1st, or in another timezone | Real clock | Inject the time. Never call "now" inside logic |
| Passes alone, fails in the suite | Shared state between tests | Each test creates and destroys its own data |
| Fails when tests run in a different order | Ordering dependence | Same fix; order must not matter |
| Fails roughly one run in ten | A race, or an unwaited async operation | Wait on the condition, never on a duration. `sleep` in a test is a bug you have not found yet |
| Breaks on every refactor without a behaviour change | Testing the implementation | Assert on behaviour and output, not on internals |
| Fails after a design tweak | Pixel-exact snapshot | Assert what must be true (element present, text correct), not the image |

**A test that has been "flaky for a while" is an untriaged bug.** Either fix it
or delete it — a permanently red or randomly red suite is a suite nobody reads.

---

## 5. Coverage is a map of what was executed, not of what was checked

Coverage measures which lines *ran* while the tests ran. It cannot see whether
anything was asserted. A test suite calling every function and asserting nothing
reports 100%.

- **Use it to find the untested**, which is what it is good at: sort by lowest
  coverage and look at what surfaces. Often it is exactly the error handling.
- **Never use it as a target.** A coverage number set as a goal gets met by
  writing tests for the easiest code, which is the code least likely to be
  wrong.
- **Where a threshold is required**, cover the branch cases in the areas from §1
  rather than raising the global percentage.

The honest version of the question is not "what percentage is covered" but
**"which of the things in §1 has no test?"** That list is short and actionable;
the percentage is neither.

---

## 6. Adding tests to code that has none

The most common real situation, and the one most guidance skips.

**Do not stop and write a suite.** It is a large amount of work with no visible
result, it will be abandoned partway, and the tests written blind to real usage
are usually the wrong ones.

Instead:

1. **Test at the bug.** Every time something breaks, write the test that would
   have caught it, then fix it. The suite grows exactly where the defects
   actually are — which is far better targeting than any upfront plan.
2. **Test at the change.** Before modifying untested code, write a test that
   captures **what it does today**, right or wrong. That is a characterisation
   test: it is not asserting correctness, it is asserting *no unintended
   change*. If it fails after your edit, you changed something you did not mean
   to.
3. **Test at the seam.** Untestable code is usually code with a dependency baked
   in — a direct database call, a hard-coded clock, a global. Pull that one
   dependency out and the code becomes testable, with a small and reviewable
   diff.
4. **Start at the boundary, not the core.** A test around a whole module's
   public interface is easier to write and more durable than trying to unit-test
   a tangle. Tighten inward later, if it is worth it.

**The order is: where it broke, where you are changing it, everywhere else —
and "everywhere else" is usually never, correctly.**

---

## 7. Before calling a suite done

- [ ] Every item in §1 that applies has a test
- [ ] The whole suite runs fast enough that it is run without thinking about it
- [ ] No test has been flaky "for a while"
- [ ] No test asserts on a private internal or an exact pixel
- [ ] Mocks stop at the boundary of what you control; the database is real
- [ ] Every bug fixed in the last month has a test proving it stays fixed
- [ ] A failure message says what broke, not just that something did
- [ ] `docs/plan.md` — every task's proof line is a command that actually proves
      it, so an unattended run can verify itself (`SKILL.md` → Artifact)
