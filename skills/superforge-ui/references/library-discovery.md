# Library discovery — outcome in, implemented choice out

**The user owns the outcome; the agent owns tool discovery.** A person asking
for a modern, tactile, cinematic, calm, or premium experience is not expected
to know the package that creates it, or to append “research the latest options.”

Use this reference when a UI request leaves the implementation technique open
and a library, framework feature, browser API, or generated primitive could
materially change the result. Do not reopen it for a bounded follow-up while the
chosen technique still fits.

## 1. Start with the product, not a package search

1. Translate the request into observable behaviour: what moves, when, in
   response to what, and what still works when motion is removed.
2. Inspect the repository: framework and version, installed dependencies,
   rendering model, design system, browser/device floor, and performance budget.
3. Establish the **native or existing stack** baseline. CSS, browser APIs, a
   small local function, or a dependency already paid for is a real candidate.

For a new Medium or Large phase whose technique is open, perform one bounded
fresh scan even when the baseline looks sufficient; that is how “native is the
better choice” becomes a checked decision rather than an assumption. Discovery
is also required before adding any version-dependent dependency. Popularity
alone is not a reason to install anything.

## 2. Discover narrowly, with fresh evidence

Search by capability and constraint, not by a remembered product name. Use
**official primary sources**: the project documentation and repository, the
package registry entry, platform documentation, and the licence. Roundups,
showcases, and social posts may reveal a candidate but cannot establish its
current API, compatibility, maintenance, or safety.

Compare the baseline with **at most three candidates**. Stop when one option is
clearly fit; exhaustive browsing delays the build without making the decision
better. For every external candidate check:

- exact fit for the intended behaviour and the project's framework;
- release and maintenance activity, unresolved blocking issues, and ownership;
- bundle/runtime cost, SSR or hydration constraints, and browser/device support;
- keyboard, touch, screen-reader, and **reduced motion** behaviour;
- **licence and security**, including dependency footprint and install scripts;
- migration and removal cost if the project or platform changes.

Record the source links and **checked date** in the durable design decision when
the choice affects multiple components or future maintenance. Do not turn a
one-off comparison into a permanent catalogue.

**Do not claim that a choice is current** when live research is unavailable.
Use the established stack or a native fallback, label the freshness limit, and
leave the decision reversible.

## 3. Decide and keep building

State a compact decision before changing dependencies:

1. **Choice and selection reason** — the experience or constraint it uniquely
   satisfies.
2. **Nearest alternative** — why native, existing, or the runner-up lost.
3. **Cost and fallback** — bytes/runtime, maintenance, accessibility, and what
   users receive when the effect is unsupported or disabled.

When the user asked to build, redesign, improve, or fix the product, **install
and implement** the selected option after this explanation. Do not return a
shopping list and wait for the user to translate it into an engineering task.
Pause only for a dependency whose cost, licence, security boundary, or visible
product tradeoff changes the user's goal.

## 4. Prove the choice in the built result

- Run the repository's build, type, lint, and relevant behaviour tests.
- Exercise the interaction with mouse, keyboard, touch, and narrow viewports.
- Confirm the runtime reduced-motion path stops JavaScript loops, autoplay, and
  scroll manipulation rather than merely shortening a CSS transition.
- Measure the cost that decided the comparison: shipped bytes, first useful
  render, frame rate on the floor device, or interaction latency.
- Remove the dependency if its measured advantage does not survive integration.

The result is not “we used a modern library.” It is a specific experience, an
auditable choice, and working code whose cost is known.
