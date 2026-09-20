# Metricores

Metricores is a full-stack calculator platform built for practical financial planning, everyday decision support, mathematical utility, and personalized user workflows. The product is designed around a clear principle: a calculator should not only produce a number, but also explain the assumption, method, and context behind that result.

This project combines a modern Next.js application, a structured calculator registry, a MongoDB-backed account layer, and a reusable calculation engine. It is built for real users who need fast answers for mortgage payments, ROI, taxes, age calculations, scientific work, graphing, and value-based planning.

The platform currently supports:

- guest browsing and limited anonymous usage
- calculator-based search and discovery
- formula-driven result generation with user-friendly formatting
- authenticated account workflows with profile and workspace persistence
- email verification and password reset
- saved calculations, favorites, recent tools, and history
- SEO-ready routing and metadata support

---

## Product Vision

Metricores is not a generic calculator app. It is designed as a utility-first product for users who need trustworthy, fast, and transparent calculations in real-world domains.

The product aims to deliver:

- fast calculation speed
- clear explanations and assumptions
- domain-specific financial context
- secure account management
- a repeatable architecture for adding new calculators
- a scalable growth foundation for search-driven traffic

This means the app is structured not only as a UI, but as a domain system: calculators, guides, metadata, user flows, session logic, and persistence all work together around a common product model.

---

## What Is Built Today

### Core product surfaces

The application currently includes:

1. Home dashboard and product entry point
2. Searchable calculator directory
3. Calculator detail pages with formulas, examples, FAQs, and result outputs
4. Scientific calculator with expression evaluation and keyboard support
5. Graphing calculator with plotting and interactive canvas controls
6. Guides section for educational content
7. Public informational pages: About, FAQ, Privacy, and Terms
8. Email/password authentication and Google OAuth login
9. Email verification and password reset flows
10. Authenticated profile management and saved calculation workspace
11. Cookie preference handling and usage limits for guest users
12. SEO metadata, sitemap, and canonical route support

### Calculator catalog

The registry includes a structured collection of calculators across multiple categories.

Current major calculators include:

- Scientific Calculator
- Graphing Calculator
- Mortgage Calculator
- Reverse Mortgage Calculator
- Loan Calculator
- Tax Calculator
- Interest Calculator
- Payment Calculator
- Time Calculator
- Age Calculator
- Profit Margin Calculator
- ROI Calculator
- Percentage Calculator
- Discount Calculator
- Tip Calculator
- VAT Calculator

Each calculator entry defines:

- a stable ID and slug
- user-facing name and description
- category and audience
- formula and assumptions
- example scenarios
- validation constraints
- related calculators and guides
- SEO metadata where appropriate

This is intentionally registry-driven so new calculators can be added without refactoring the entire UI.

---

## Technical Architecture

Metricores is built as a Next.js App Router application with a modular architecture that separates product concerns clearly.

### High-level architecture

```text
Client Browser
   |
   v
Next.js App Router
   |
   +--> Public pages and content routes
   |
   +--> Calculator routes and UI components
   |
   +--> Auth API routes and session management
   |
   +--> User workspace and profile APIs
   |
   +--> Shared calculator registry and domain utilities
   |
   +--> MongoDB database layer
   |
   +--> SMTP-based email delivery
```

### Architectural principles

1. Domain logic is separated from UI presentation.
2. Calculator definitions live in a central registry, not scattered in component code.
3. Calculators share a common result contract so the UI can render data consistently.
4. Auth and persisted user operations are server-side only.
5. Public content and private user flows are intentionally separated.
6. The project is designed to grow without introducing brittle one-off logic.

---

## How the Calculator System Works

### Registry-driven calculator model

The source of truth for calculator behavior is in `data/calculators.ts`.

Each calculator definition contains:

- numeric and select input fields
- validation metadata
- format labels and units
- assumptions and limitations
- example explanation
- related calculators and educational guides
- SEO metadata

This makes the platform easier to scale because adding a new calculator is mostly a data task, not a full UI rewrite.

### Calculation execution flow

For a normal calculator, the runtime flow is:

1. The user lands on a calculator route.
2. The page resolves the calculator ID and loads its registry definition.
3. The UI renders the appropriate form fields.
4. Values are normalized into a structured object.
5. The shared calculation dispatcher selects the correct logic by calculator ID.
6. The domain logic computes a result set.
7. Results are formatted and rendered in the UI.
8. Authenticated users can save or reference the result in their workspace.

This pattern keeps the experience consistent across calculators while allowing different business logic for each tool.

### Shared result contract

The result model is intentionally generic. Each calculator returns a consistent structure so the UI can render values such as:

- currency
- percentages
- numbers
- dates
- text summaries

This avoids building one-off UI logic for every calculator type.

---

## Scientific and Graphing Calculators

### Scientific calculator

The scientific calculator is implemented as a specialized interface because it is not a simple form-based calculator.

It supports:

- expression evaluation
- trig functions and logarithms
- parentheses and precedence handling
- keyboard input
- memory operations
- degree and radian mode switching
- local calculation history

This component is built around direct interaction and does not rely on a normal form schema.

### Graphing calculator

The graphing tool uses expression parsing and a canvas renderer to visualize mathematical functions.

It supports:

- multiple expressions
- grid and axis controls
- pan and zoom interaction
- theme and fullscreen behavior
- local math evaluation in the browser
- output export or visual inspection

This is a high-value interactive surface that is distinct from standard calculator forms and is intentionally separated from the server-side business logic.

---

## Guides and Educational Content

The guides system is designed to answer real user questions in a practical, educational way.

Each guide includes:

- purpose
- title and description
- introduction
- structured sections
- examples
- methodology explainers
- calculator CTA
- relevant related calculators
- related guides
- last-reviewed date

The guides are not generated as low-value keyword pages. They are built around real user needs such as:

- mortgage amortization
- how tax brackets work
- profit margin vs markup
- general financial understanding

This content is meant to support the calculators, not replace them.

---

## Authentication and User Management

### Authentication providers

The app currently supports:

- email and password sign-in
- Google OAuth sign-in

Both are managed through NextAuth with a MongoDB-backed user model.

### Security model

The auth layer handles:

- password hashing with bcrypt
- secure token generation
- hashed verification tokens stored in the database
- token expiry enforcement
- password reset validation
- session-based access control on protected endpoints
- user identity validation for workspace updates

This is an important security boundary. User data is never edited without a valid authenticated session.

### Email verification flow

The signup process:

1. Validates required fields and password policy
2. Hashes the password
3. Creates a secure verification token
4. Saves only the hashed token and expiry date in MongoDB
5. Sends the raw token to the user by email
6. Confirms the email when the user visits the verification route

This design protects token information even if the database is compromised.

### Password recovery flow

The password reset flow:

- generates a short-lived reset token
- stores only a hash of that token
- rate-limits repeated requests
- prevents account enumeration through generic responses
- verifies the current password before allowing a password change, where applicable

---

## User Workspace and Persistence

Authenticated users can save their work in a workspace model stored in MongoDB.

The workspace currently includes:

- calculation history
- saved results
- favorite calculators
- recently used tools

Each record contains:

- calculator ID
- calculator name
- category
- inputs
- result outputs
- optional custom label
- timestamp

This allows users to return to meaningful calculations and continue from where they left off.

### Current workspace logic

The workspace APIs support:

- reading the user workspace
- saving a result to history or saved items
- tracking recent calculators
- favoriting calculators
- deleting saved or history entries
- clearing history

The structure is intentionally lightweight and suitable for a growing user base without overengineering early product features.

---

## Data and Storage Layer

Metricores uses MongoDB with Mongoose for persistent data.

### Database responsibilities

The database is used for:

- user accounts
- auth-related metadata
- email verification state
- password reset state
- workspace data
- saved calculation history

The MongoDB connection is cached in `lib/db/connect.ts` to avoid redundant connections during hot reloads and repeated server calls.

### Schema strategy

The user schema includes:

- personal profile info
- auth provider information
- email verification and reset metadata
- account status and timestamps
- embedded workspace arrays

This keeps the initial architecture straightforward while still supporting future growth into more complex storage patterns if needed.

---

## API Surface

The application exposes several server endpoints for authentication and user operations.

### Auth endpoints

- `/api/auth/[...nextauth]` — NextAuth session handling
- `/api/auth/signup` — signup with validation and verification email trigger
- `/api/auth/verify-email` — email verification endpoint
- `/api/auth/resend-verification` — resend verification email
- `/api/auth/forgot-password` — recovery token generation
- `/api/auth/reset-password` — set a new password from a valid token

### User endpoints

- `/api/user/workspace` — read and mutate saved histories and favorites
- `/api/user/profile` — update profile details
- `/api/user/password` — change or set password

These APIs enforce session checks and validate the request before modifying user data.

---

## App Routes and User Journeys

The app includes a public and authenticated route structure.

### Public routes

- `/` — home and discovery page
- `/calculators` — calculator directory
- `/calculators/[id]` — individual calculator
- `/guides` — educational content
- `/about` — about page
- `/faq` — FAQs
- `/privacy` — privacy policy
- `/terms` — terms page
- `/auth` — login and signup

### Authenticated routes

- `/profile` — user profile and settings
- `/forgot-password` — password recovery request
- `/reset-password` — complete recover flow
- `/verify-email` — verification status completion

This separation helps keep public content discoverable while private experiences remain gated behind authentication.

---

## SEO and Product Discovery

The product includes a search-focused foundation to support sustainable organic discovery.

Current SEO-oriented elements include:

- metadata generation for calculator routes
- sitemap generation
- robots policy configuration
- canonical route support
- structured calculator metadata
- landing pages built around real calculator intent

This is designed for quality, not spammy keyword mass-generation. The architecture favors genuine utility and coherent search intent instead of publishing thin pages for every keyword variation.

---

## Security and Privacy

The app includes multiple safety controls:

- bcrypt password hashing
- secure token generation and hashing
- expiry checks for email and reset tokens
- rate limiting on sensitive actions
- generic password reset responses to reduce enumeration risk
- authenticated checks on protected routes
- input sanitization for user-generated text
- URL validation for profile images
- secure headers and privacy controls

### Important limitation

The guest calculation cap and client-side protections are user-experience features, not a security boundary. They can be bypassed by a malicious user. Real production abuse protection requires server-side enforcement and broader operational controls.

---

## Environment and Local Setup

### Required software

- Node.js
- npm
- MongoDB instance
- SMTP provider for email delivery (or dev fallback)

### Configuration

Create a `.env.local` file with variables such as:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/metricores
NEXTAUTH_SECRET=your-very-long-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

The app will use local console preview links in development when SMTP is not configured.

### Install dependencies

```bash
npm install
```

### Start the app

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Production-like run

```bash
npm run build
npm start
```

---

## Scripts and Validation

### Available scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm test
```

### Validation strategy

The project includes automated checks for:

- calculator correctness
- age/date edge cases
- reverse mortgage logic
- password policy behavior
- security helper behavior
- search-intent and guide-quality architecture contracts

This is a solid baseline for product quality, but browser-level end-to-end tests are still a recommended next step for high-risk user flows.

---

## Testing Philosophy

The application follows a practical engineering approach:

- logic-heavy calculators are validated via unit tests
- business rules are tested independently from the UI
- auth, email, and persistence flows are validated around typed server behavior
- edge cases are tested explicitly, especially for date math and financial assumptions

The project is not built on mock-heavy testing alone. It focuses on verifying actual calculations and real domain rules.

---

## Performance and Product Quality

The platform is optimized for a utility-first experience:

- lightweight calculator pages
- shared UI patterns
- server-rendered route architecture where appropriate
- reusable domain logic
- low-friction guest experience
- persistent user workspace without unnecessary complexity

The project is intentionally designed to stay fast and calm rather than introducing unnecessary animation or marketing-heavy UI noise.

---

## What Is Already Working

At a product level, the application already demonstrates the following:

- calculator discovery and browse flow
- functional form-based calculators
- specialized scientific and graphing tools
- input validation and result rendering
- user authentication and session handling
- profile and persisted workspace behavior
- guides content with calculator relevance
- metadata and public route structure for indexed pages
- a modular architecture for future scale

This is a solid foundation for a real calculator platform rather than a single-page demo.

---

## Current Limitations and Honest Constraints

This project is not yet a fully mature financial SaaS platform. Some important constraints remain:

- certain financial outputs are educational estimates, not financial advice
- the app does not yet have a full browser E2E suite
- no CI/CD deployment pipeline is configured in the repo yet
- the architecture is ready for growth but not yet fully expanded into premium SaaS features
- some production security controls still require operational hardening, monitoring, and broader review
- user data model can expand over time as product complexity grows

This honesty matters. The app is functional and production-aware, but it is still evolving toward a larger scale product architecture.

---

## Recommended Next Iteration

The product is in a good place for the next engineering phase:

1. expand and tighten browser E2E tests
2. strengthen monitoring and observability
3. review and harden production security posture further
4. expand calculation quality and methodology transparency
5. improve internal linking and content relevance around calculator categories
6. validate product analytics from organic and user behavior data
7. plan safe monetization and premium expansion only after product-market evidence exists

This keeps the roadmap practical and product-driven rather than speculative.

---

## Final Summary

Metricores is a practical calculator platform with a strong domain-driven architecture. It already has the foundations of a real product: working calculators, user account flows, persisted workspace capabilities, structured content, and a scalable framework for future additions.

What differentiates it is not just the number of tools, but the way those tools are organized around real user intent, consistent calculation logic, and a long-term product architecture.

The project is positioned as a useful, scalable, and maintainable platform for financial and mathematical utility rather than a shallow collection of pages or gimmicky tools.

---

## License

Metricores is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Metricores.
