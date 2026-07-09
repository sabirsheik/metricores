# Metricores Calculator Formula & Engine Registry

Metricores powers all financial calculators using a **single-source modular registry**. To prevent duplicate logic, every calculator is fully defined in standard schemas, which are then fed into the universal calculator UI and execution engine.

## Directory Structure

Every calculator in Metricores adheres to the following layout:
- `README.md` — Explains the mathematical formula model and specific business application.
- `formula.ts` — Contains the pure, testable, and side-effect-free calculation functions.
- `types.ts` — Extends the base types to define strict validation parameters and result types.
- `constants.ts` — Houses default presets, ranges, steps, and compliance constants.
- `example.ts` — Details the scenario, target users, and expected verification case study.

## The Shared Calculator Engine

Calculations are dispatched using the central `calculate` utility engine located in `/src/data/calculators.ts` which imports and coordinates all functional formula modules under `/src/lib/calculators/`.

This setup guarantees:
1. **No Duplicated UI Logic** — Input parameters, results layout, resets, and printing are controlled by `/src/components/calculator/CalculatorCard.tsx`.
2. **Deterministic Calculations** — Formula steps are documented and matched line-by-line with standard corporate finance models.
3. **Accessibility** — Built-in support for keyboard, focus indicators, and screen reader announcements.
