# Metricores

Metricores is a full-stack calculator platform for financial planning, practical mathematics, personal finance, date calculations, scientific computation, and interactive graphing. It is designed around a simple product principle: a calculator should return a useful answer and explain how that answer was produced.

The application supports two usage modes:

- **Guest mode:** users can browse the product and run a limited number of calculations without creating an account.
- **Authenticated workspace:** users can save calculation results, inspect history, favorite calculators, revisit recently used tools, and manage their profile.

This document describes the implemented system, its runtime behavior, the main code paths, local setup, testing strategy, and production considerations.

## Contents

- [Metricores](#metricores)
  - [Contents](#contents)
  - [What Has Been Built](#what-has-been-built)
    - [Product surfaces](#product-surfaces)
    - [Calculator catalog](#calculator-catalog)
  - [Technology Stack](#technology-stack)
  - [System Architecture](#system-architecture)
    - [Request and calculation flow](#request-and-calculation-flow)
    - [Database connection strategy](#database-connection-strategy)
  - [Repository Structure](#repository-structure)
  - [Application Routes](#application-routes)
  - [Calculator System](#calculator-system)
    - [Registry-driven design](#registry-driven-design)
    - [Implemented calculation behavior](#implemented-calculation-behavior)
    - [Scientific calculator](#scientific-calculator)
    - [Graphing calculator](#graphing-calculator)
  - [Authentication and Account Lifecycle](#authentication-and-account-lifecycle)
    - [Providers](#providers)
    - [Email verification](#email-verification)
    - [Password reset](#password-reset)
    - [User model](#user-model)
  - [Workspace and Persistence](#workspace-and-persistence)
  - [Client-Side State and Guest Limits](#client-side-state-and-guest-limits)
  - [API Reference](#api-reference)
    - [Authentication APIs](#authentication-apis)
    - [User APIs](#user-apis)
  - [Environment Configuration](#environment-configuration)
  - [Local Development](#local-development)
    - [Prerequisites](#prerequisites)
    - [Install dependencies](#install-dependencies)
    - [Start development mode](#start-development-mode)
    - [Production-like local run](#production-like-local-run)
  - [Testing and Validation](#testing-and-validation)
    - [Available commands](#available-commands)
    - [Current automated coverage](#current-automated-coverage)
  - [Production Deployment](#production-deployment)
    - [Required services](#required-services)
    - [Deployment checklist](#deployment-checklist)
  - [Security and Privacy](#security-and-privacy)
    - [Important privacy behavior](#important-privacy-behavior)
  - [Known Limitations](#known-limitations)
  - [Engineering Extension Guide](#engineering-extension-guide)
    - [Add a standard calculator](#add-a-standard-calculator)
    - [Add a specialized interactive calculator](#add-a-specialized-interactive-calculator)
    - [Add a persisted user feature](#add-a-persisted-user-feature)
    - [Code quality expectations](#code-quality-expectations)
  - [Product Disclaimers](#product-disclaimers)
  - [License](#license)

## What Has Been Built

### Product surfaces

The implemented product includes:

1. A home dashboard for discovering calculators.
2. A searchable and filterable calculator directory.
3. Individual calculator workspaces with typed inputs, validation, formatted results, formulas, examples, and FAQs.
4. A dedicated scientific calculator with keyboard input, degree/radian modes, memory operations, and local calculation history.
5. A dedicated graphing calculator with expression parsing, plotting, pan and zoom interactions, grid controls, presets, themes, fullscreen mode, and downloadable output.
6. A guides area for educational content.
7. Static About, FAQ, Privacy, and Terms pages.
8. Email/password and Google authentication.
9. Email verification and password-reset flows.
10. An authenticated profile and calculation workspace.
11. Cookie preference controls and a guest calculation limit.
12. Security response headers configured through Next.js.

### Calculator catalog

The shared calculator registry currently defines 16 calculators:

| Category | Calculators |
| --- | --- |
| Basic Mathematics | Scientific, Graphing, Percentage, Discount & Sale, Tip & Split |
| Financial Mathematics | Mortgage, Loan, Interest, Payment, ROI |
| Personal Finance | Reverse Mortgage |
| Practical Mathematics | Profit Margin, VAT |
| Planning / Everyday | Tax, Time, Age |

The registry contains each calculator's ID, display metadata, category, input definitions, formula explanation, worked example, and FAQs. The calculation dispatcher contains the reusable business logic for the general calculators. Scientific and graphing tools have specialized interactive components because their interaction models are different from ordinary form-submit calculators.

## Technology Stack

| Concern | Technology | Role |
| --- | --- | --- |
| Framework | Next.js 16 App Router | Routing, server rendering, metadata, API route handlers, production server |
| UI runtime | React 19 | Client components and interactive calculator experiences |
| Language | TypeScript 5.8 | Static typing across UI, API, utilities, and data models |
| Styling | Tailwind CSS 3, PostCSS, custom CSS | Responsive layout, design tokens, utilities, global styles |
| Animation | Motion | Page and directory transitions |
| Icons | Lucide React | Consistent interface icons |
| Forms | React Hook Form, Zod | Form state and validation support |
| Authentication | NextAuth 4 | Google OAuth, credentials authentication, sessions |
| Database | MongoDB, Mongoose 9 | Users and persisted calculation workspace data |
| Password security | bcryptjs | Password hashing and verification |
| Email | Nodemailer | Verification and password-reset delivery |
| Notifications | Sonner | Client-side toast feedback |
| Testing | Node test runner, tsx | TypeScript unit tests |

`@google/genai` is present as a dependency and the project metadata references a server-side Gemini capability, but the current application code does not use a Gemini API call in the calculator or authentication paths. Any future AI feature should be added as an explicit server-side boundary with its own environment configuration and tests.

## System Architecture

Metricores follows a conventional Next.js App Router structure with a clear separation between route composition, interactive client views, domain utilities, and persistence.

```text
Browser
  |
  v
Next.js App Router pages and client views
  |
  +--> Calculator registry and calculation dispatcher
  |      |
  |      +--> Domain utilities: age, reverse mortgage, math parser, formatting
  |
  +--> NextAuth session endpoints
  |      |
  |      +--> MongoDB User model
  |
  +--> User API routes
         |
         +--> MongoDB via cached Mongoose connection
         +--> Nodemailer for verification/reset emails
```

### Request and calculation flow

For a standard calculator, the flow is:

1. The route loads the calculator ID from the URL.
2. The calculator registry supplies the input schema and explanatory content.
3. The client renders the appropriate input controls.
4. Input values are normalized into a plain object.
5. The shared `calculate(id, inputs)` dispatcher selects the implementation for that calculator.
6. The implementation returns normalized `ResultField[]` values.
7. The UI formats the values and renders primary results, supporting metrics, formula details, examples, FAQs, and actions.
8. Signed-in users can persist the inputs and results through the workspace API.

The result shape is intentionally generic so the shared calculator UI can render currency, percentages, numbers, dates, and text without knowing the internal formula for every calculator.

### Database connection strategy

`lib/db/connect.ts` stores the Mongoose connection and in-flight connection promise on the global object. This prevents unnecessary connections during development hot reloads and serverless-style module re-evaluation. Command buffering is disabled so database failures surface promptly instead of waiting in an internal queue.

## Repository Structure

```text
app/
  page.tsx                         Home route and page metadata
  layout.tsx                       Root providers, global metadata, toaster
  layout-client.tsx                Client-side shell and navigation behavior
  home-client.tsx                  Home page composition
  calculators/                     Directory and calculator detail routes
  auth/                            Sign-in, sign-up, and OAuth UI
  profile/                         Authenticated profile/workspace UI
  guides/                          Educational guide route
  about/ faq/ privacy/ terms/      Content routes
  api/                             Next.js server route handlers

components/
  HomeView.tsx                     Home experience
  CalculatorsDirectory.tsx         Search, category filters, sorting, cards
  CalculatorView.tsx               Shared calculator entry point
  calculator/                      Form calculator and result components
  ScientificCalculator.tsx         Scientific calculator interaction model
  GraphingView.tsx                 Graphing calculator interaction model
  AccountWorkspace.tsx             Saved/history/favorites workspace
  ProfileView.tsx                  Profile and password settings
  ui/                              Shared loading primitives

data/
  calculators.ts                   Calculator registry and dispatcher
  guides.ts                        Guide article data

lib/
  AppContext.tsx                   Cookie and guest usage state
  email.ts                         SMTP transport and email templates
  token.ts                         Secure token generation and hashing
  db/connect.ts                    Cached MongoDB connection
  db/models/User.ts                User and workspace Mongoose schema

utils/
  age.ts                           Calendar-aware age calculations
  reverseMortgage.ts               Reverse mortgage estimate model
  mathParser.ts                    Graph expression parsing/evaluation
  password.ts                      Password policy validation
  format.ts                        Display formatting helpers
  cn.ts                            Class-name composition helper

types.ts                           Shared domain types
types/                              NextAuth and global type augmentation
tests/                              Unit tests for calculation and validation logic
public/                             Static assets
```

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Home dashboard and primary calculator discovery |
| `/calculators` | Searchable calculator directory |
| `/calculators/[id]` | Individual calculator workspace |
| `/guides` | Educational guides |
| `/about` | Product and company information |
| `/faq` | Frequently asked questions |
| `/auth` | Sign in, sign up, and Google sign-in |
| `/profile` | Profile, password, favorites, history, and saved calculations |
| `/forgot-password` | Password-reset request form |
| `/reset-password?token=...` | Password-reset completion form |
| `/verify-email` | Verification status UI |
| `/privacy` | Privacy information and cookie preferences |
| `/terms` | Terms of service |

Calculator detail pages generate metadata from the selected calculator's registry entry. Invalid IDs receive a not-found title and description instead of calculator-specific metadata.

## Calculator System

### Registry-driven design

`data/calculators.ts` is the source of truth for the catalog. `CalculatorSchema` defines:

- Stable calculator ID and display name
- Short description and category
- Optional search keywords
- Input fields, defaults, bounds, units, and select options
- Formula equation and explanatory steps
- Worked example
- Frequently asked questions

This allows the directory and detail pages to remain generic while calculator-specific metadata stays close to the calculator it describes.

### Implemented calculation behavior

- **Mortgage:** fixed-rate monthly payment, principal, total interest, and total cost using the standard annuity formula. A zero-interest branch avoids division by zero.
- **Loan:** monthly repayment, total interest, and total repayment cost.
- **Reverse mortgage:** illustrative borrowing capacity, initial advance, mortgage payoff, costs, balance growth, interest, repayment balance, and remaining equity over a projection period. Input validation includes age, rate, term, and debt bounds.
- **Tax:** taxable income after deductions and bracket-based estimate based on filing status.
- **Interest:** interest growth and accumulated value calculations based on the selected model and rate inputs.
- **Payment:** payment and repayment metrics for a principal, rate, and term.
- **Time:** conversion and difference calculations for time-based inputs.
- **Age:** calendar-aware years, months, and days, including leap years, February 29, month-end borrowing, totals, next birthday, day of birth, and age status.
- **Profit margin:** profit and margin metrics from revenue and cost.
- **ROI:** return, gain, and percentage return from investment inputs.
- **Percentage:** percentage-of, ratio, and percentage-change operations.
- **Discount:** savings, sale price, tax, and final price.
- **Tip:** gratuity, grand total, and per-person split.
- **VAT:** VAT addition for exclusive values and extraction from inclusive totals.
- **Scientific:** specialized expression evaluation in the scientific calculator component.
- **Graphing:** expression parsing and canvas plotting in the graphing calculator component.

Financial and tax results are estimates. They do not include every lender rule, jurisdiction-specific tax rule, fee, insurance charge, underwriting condition, or product-specific restriction.

### Scientific calculator

The scientific calculator is intentionally implemented as its own interaction surface. It supports degree/radian mode selection, trigonometric and logarithmic operations, exponentials, factorials, parentheses, keyboard input, memory operations, and local history. Its state is not represented by a normal input schema because the user interacts with a calculator keypad and expression display rather than a fixed form.

### Graphing calculator

The graphing experience uses `utils/mathParser.ts` to parse supported mathematical expressions and `GraphingView.tsx` to render the coordinate plane. It supports multiple expressions, real-time evaluation, pan and zoom, grid and axis controls, presets, themes, fullscreen mode, and downloadable output. Expressions are evaluated locally in the browser; no graphing calculation is sent to the server.

## Authentication and Account Lifecycle

### Providers

NextAuth is configured with:

- **Credentials provider:** email and password checked against the MongoDB `User` document.
- **Google provider:** OAuth sign-in that creates or updates a local user record and marks the account as verified.

Credentials passwords are hashed with `bcryptjs` before storage. The credentials authorization path rejects missing credentials, unknown users, unverified accounts, and invalid passwords.

### Email verification

During signup:

1. The request validates required fields and the password policy.
2. The password is hashed with bcrypt.
3. A cryptographically random token is generated.
4. Only the SHA-256 token hash and a 24-hour expiry are stored in MongoDB.
5. The raw token is sent by Nodemailer or logged as a development-only preview link when SMTP is not configured.
6. The verification endpoint hashes the submitted token, checks the expiry, marks the user as verified, and clears the token fields.

### Password reset

The reset flow uses a separate random token and one-hour expiry. The API avoids revealing whether an email belongs to an account by returning a generic success message for unknown, unverified, or Google-only users. Reset attempts are rate-limited to five requests per hour for a user record. A new password must satisfy the password policy and differ from the current password.

### User model

The Mongoose user schema contains identity fields, provider information, account status, email-verification fields, reset fields, profile fields, login timestamps, and embedded calculation workspace arrays. Username and email are normalized and indexed through unique constraints; username is sparse to allow users without one.

## Workspace and Persistence

The authenticated workspace is embedded in the user document:

```text
User
  history: up to 50 CalculationRecord items
  savedCalculations: up to 50 CalculationRecord items
  favoriteCalculators: calculator IDs
  recentlyUsed: up to 8 calculator IDs
```

Each `CalculationRecord` stores the calculator ID and name, category, input object, result fields, optional user-defined name, and ISO timestamp.

The workspace route validates calculator IDs against the registry before accepting a record. History and saved items are newest-first. Favorite updates are set-like operations, so enabling a favorite does not create duplicates. Deletion supports individual history items, individual saved items, and clearing all history.

## Client-Side State and Guest Limits

`AppContext` provides cross-application state for cookie preferences and anonymous usage:

- Cookie consent, analytics preference, and marketing preference are stored in `localStorage`.
- Guest users may complete three calculations, tracked under `metricores-guest-calculation-usage`.
- The usage count is loaded after hydration and synchronized across browser tabs through the `storage` event.
- When the limit is reached, the guest-limit modal opens and the user is directed toward authentication.

The guest limit is a client-side product control, not a server-side quota or abuse-prevention mechanism. Any production requirement for enforceable quotas would need server-side identity or device controls.

## API Reference

### Authentication APIs

| Method | Endpoint | Behavior |
| --- | --- | --- |
| `GET`, `POST` | `/api/auth/[...nextauth]` | NextAuth session, credentials, and Google OAuth handlers |
| `POST` | `/api/auth/signup` | Validates input, creates an email account, and sends verification email |
| `GET` | `/api/auth/verify-email?token=...` | Verifies an unexpired email token and redirects to auth UI |
| `POST` | `/api/auth/resend-verification` | Requests a new verification email |
| `POST` | `/api/auth/forgot-password` | Starts password recovery with a generic response |
| `POST` | `/api/auth/reset-password` | Validates token and replaces the password |

### User APIs

| Method | Endpoint | Behavior |
| --- | --- | --- |
| `GET` | `/api/user/workspace` | Returns history, saved calculations, favorites, and recents |
| `POST` | `/api/user/workspace` | Adds history, recent, favorite, or saved workspace data |
| `DELETE` | `/api/user/workspace` | Deletes history items, saved items, or all history |
| `PUT` | `/api/user/profile` | Updates name, username, bio, and validated profile image URL |
| `PUT` | `/api/user/password` | Changes an email password or sets the first password for a Google account |

User endpoints resolve the current session with `getServerSession`, require a user ID, connect to MongoDB, and return `401 Unauthorized` for unauthenticated requests.

## Environment Configuration

Create `.env.local` in the project root. Never commit this file.

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/metricores

# NextAuth
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000

# Optional public metadata origin
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# SMTP email delivery
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

The email module also accepts `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM` as fallback names. In development, when usable SMTP configuration is absent, verification and reset links are written to the server console as preview links. In non-development environments, missing SMTP configuration causes email delivery to fail rather than silently pretending that an email was sent.

Google OAuth must be configured with a callback URL appropriate to the deployment, normally ending in `/api/auth/callback/google`. `NEXTAUTH_URL` must match the public origin used to generate verification and password-reset links.

## Local Development

### Prerequisites

- Node.js compatible with the installed Next.js version
- npm
- MongoDB for authentication and account workspace features

Calculators that do not require authentication can be inspected without a database, but signup, sign-in, verification, password recovery, profile updates, and workspace persistence require a reachable MongoDB instance.

### Install dependencies

```bash
npm ci
```

### Start development mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production-like local run

```bash
npm run build
npm start
```

The development and production servers both use port `3000` by default. Change the script or provide the hosting platform's port strategy when deploying behind a managed runtime.

## Testing and Validation

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Compile and build the production application |
| `npm start` | Serve the production build on port 3000 |
| `npm run lint` | Run TypeScript validation with `tsc --noEmit` |
| `npm test` | Run all `tests/*.ts` files through `tsx` and Node's test runner |
| `npx tsx --test tests/age-calculator.test.ts` | Run one focused test file |

### Current automated coverage

- Calendar-aware age calculations, leap years, month boundaries, reversed ranges, and dispatcher registration.
- Password strength and complexity requirements.
- Reverse mortgage projections, zero-interest behavior, input rejection, and dispatcher registration.

The repository does not currently include a browser end-to-end test suite. Authentication journeys, workspace mutations, graph rendering, responsive behavior, and accessibility should be covered with browser tests before a high-risk production release.

## Production Deployment

### Required services

1. A managed MongoDB deployment with a restricted application user.
2. A hosting environment capable of running a Next.js production build.
3. A strong `NEXTAUTH_SECRET` stored in the platform's secret manager.
4. An SMTP provider for verification and password-reset email.
5. Google OAuth credentials if Google sign-in is enabled.

### Deployment checklist

- Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the exact public HTTPS origin.
- Configure the production MongoDB connection string and network access rules.
- Configure SMTP and verify that both email templates render and deliver correctly.
- Add the production Google OAuth callback URL, if applicable.
- Run `npm run lint`, `npm test`, and `npm run build` in CI.
- Confirm that secrets are server-only and are not prefixed with `NEXT_PUBLIC_`.
- Verify redirects for valid, expired, and malformed verification/reset tokens.
- Verify unauthorized behavior for every user API endpoint.
- Confirm the application is served over HTTPS.

There is currently no deployment manifest, migration framework, seed command, or CI workflow in the repository. User records are created through signup or Google sign-in, and workspace data is created through authenticated application actions.

## Security and Privacy

Implemented controls include:

- bcrypt password hashing before database storage.
- SHA-256 hashing of email-verification and password-reset tokens at rest.
- Expiring verification and reset tokens.
- Generic password-reset responses that reduce account-enumeration leakage.
- Session checks on profile, password, and workspace APIs.
- Calculator ID validation before workspace writes.
- URL validation for remote profile images.
- Development-only redaction of sensitive authentication debug fields.
- `X-Frame-Options: DENY` to reduce clickjacking exposure.
- `X-Content-Type-Options: nosniff` to reduce MIME-sniffing exposure.
- Strict-origin referrer policy.
- Disabled camera, microphone, and geolocation permissions through `Permissions-Policy`.

### Important privacy behavior

Calculator inputs and results are local until a signed-in user explicitly saves or records them through the workspace behavior. Guest counters, cookie preferences, and scientific calculator history use browser `localStorage`. Authenticated workspace records are stored in the user's MongoDB document.

The security headers do not replace a complete production security program. Rate limiting for all public endpoints, CSRF strategy review, structured audit logging, dependency scanning, content security policy design, and operational monitoring should be evaluated before exposing the application at scale.

## Known Limitations

- Financial, reverse-mortgage, and tax outputs are planning estimates rather than regulated advice or lender quotes.
- The guest calculation limit is enforced in the browser and can be cleared by the user; it is not an abuse-prevention boundary.
- General calculator unit tests exist, but browser-level coverage is not yet present.
- Workspace data is embedded in the user document and capped at 50 history and 50 saved records; a high-volume product may eventually need separate collections.
- There is no migration or seed framework.
- There is no repository-level deployment or CI configuration.
- The current NextAuth configuration enables debug mode; production logging should be reviewed and minimized before release.
- The metadata and dependency list mention a Gemini capability, but no active Gemini integration is currently wired into the product.
- No license file is included. Distribution terms must be decided before public redistribution.

## Engineering Extension Guide

### Add a standard calculator

1. Add a new literal ID to `CalculatorId` in `types.ts`.
2. Add a complete `CalculatorSchema` entry to `calculatorsData` in `data/calculators.ts`.
3. Define inputs with stable IDs, defaults, bounds, units, and user-facing tooltips.
4. Add a dispatcher case to `calculate` that returns `ResultField[]`.
5. Add the calculator's category to the directory grouping if the category is new.
6. Add focused tests for normal values, boundary values, invalid values, and dispatcher registration.
7. Confirm metadata, save/history behavior, and responsive rendering.

### Add a specialized interactive calculator

Use a dedicated component when the interaction model is not a fixed form, such as a keypad, canvas, drag gesture, continuous plot, or local expression history. Keep domain parsing and evaluation in a utility module, keep rendering concerns in the component, and avoid putting browser-only logic in server components.

### Add a persisted user feature

1. Extend the shared type in `types.ts`.
2. Update the Mongoose schema in `lib/db/models/User.ts`.
3. Add authenticated API behavior with explicit input validation and bounded writes.
4. Update the client workspace/profile surface.
5. Add unauthorized, validation, success, and failure tests.
6. Consider whether embedded user data remains appropriate for the expected growth rate.

### Code quality expectations

Keep calculation logic deterministic and independently testable. Keep secrets and database access on the server. Preserve the generic result contract for standard calculators. Document user-visible assumptions directly in the calculator metadata, especially for tax and financial models.

## Product Disclaimers

Metricores is an educational and planning tool. Tax calculations are simplified estimates and are not tax advice. Mortgage, loan, interest, ROI, payment, and reverse-mortgage results may omit fees, insurance, lender rules, eligibility requirements, jurisdiction-specific rules, and other real-world conditions. Users should verify material financial decisions with a qualified professional.

## License

No license file is currently included. Decide and document the intended licensing and redistribution terms before publishing the project.