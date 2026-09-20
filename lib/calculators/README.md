# Metricores Calculator Registry

Metricores uses a registry-driven calculator architecture. Calculator metadata, input definitions, formulas, assumptions, examples, FAQs, and related content are maintained in `data/calculators.ts` and rendered by the shared calculator components.

## Directory Structure

The current repository does not use a separate formula directory for every calculator. Standard calculator dispatch and domain-specific utilities are implemented in `data/calculators.ts` and `utils/`, while interactive scientific and graphing experiences use dedicated components.

## The Shared Calculator Engine

Calculations are dispatched using the central `calculate` utility in `data/calculators.ts`, which coordinates the shared registry and domain utilities under `utils/`.

This setup guarantees:
1. **Shared UI Logic** — Standard input parameters and result layouts are rendered by the reusable calculator components under `components/calculator/`.
2. **Deterministic Calculations** — Calculation functions are deterministic for the same validated input values, with assumptions documented in the registry.
3. **Focused Tests** — Logic-heavy utilities and registry contracts are covered by the tests under `tests/`.
