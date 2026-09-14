# Metricores

Metricores is a web-based calculator workspace built with Next.js. It combines everyday financial and practical calculators with scientific and graphing tools, explanatory formulas, examples, FAQs, and optional user accounts for saving calculation history and preferences.

## Highlights

- 14 calculators across mathematics, finance, tax, time, and everyday planning
- Scientific calculator with DEG/RAD modes, trigonometry, logarithms, memory, keyboard input, and local history
- Interactive graphing calculator with multiple expressions, pan and zoom, grid/axis controls, themes, presets, fullscreen mode, and image export
- Formula explanations, worked examples, and FAQs for calculator pages
- Guest usage limits with browser-based tracking
- Credentials authentication with email verification and password reset
- Google OAuth sign-in
- Authenticated profile and workspace features for saved calculations, favorites, recent calculators, and history
- Responsive interface with shared navigation, toast notifications, cookie preferences, and loading states

## Calculator Directory

| Calculator | Purpose |
| --- | --- |
| Scientific | Advanced arithmetic, functions, trigonometry, logarithms, exponentials, factorials, and memory operations |
| Graphing | Plot supported mathematical expressions on an interactive coordinate plane |
| Mortgage | Estimate monthly payment, total interest, and total mortgage cost |
| Loan | Estimate amortized payments, total interest, and total repayment |
| Tax | Estimate simplified progressive federal tax and take-home amount |
| Interest | Model simple or monthly-compounded growth with contributions |
| Payment | Calculate a required payment or estimate payoff duration |
| Time | Compare dates, calculate business days, and offset dates |
| Profit Margin | Analyze margin and markup or calculate a target selling price |
| ROI | Calculate profit, total ROI, and annualized ROI/CAGR |
| Percentage | Calculate percentages, proportions, and percentage change |
| Discount | Calculate savings, sale price, sales tax, and final price |
| Tip | Calculate tip, total bill, and per-person share |
| VAT | Add or remove VAT and calculate net or gross amounts |

The calculator registry and general calculation dispatcher live in [`data/calculators.ts`](data/calculators.ts). The scientific calculator is implemented in [`components/calculator/ScientificCalculator.tsx`](components/calculator/ScientificCalculator.tsx), while graphing expressions are parsed by [`utils/mathParser.ts`](utils/mathParser.ts) and rendered by [`components/GraphingView.tsx`](components/GraphingView.tsx).

## User-Facing Routes

| Route | Description |
| --- | --- |
| `/` | Home dashboard and calculator discovery |
| `/calculators` | Complete calculator directory |
| `/calculators/[id]` | Calculator workspace with formula, example, and FAQ content |
| `/guides` | Strategy and educational guides |
| `/about` | Product information |
| `/faq` | Frequently asked questions |
| `/auth` | Sign in, sign up, and Google sign-in |
| `/profile` | Profile, security, favorites, history, and saved workspace |
| `/forgot-password` | Request a password reset |
| `/reset-password?token=...` | Set a new password from a reset link |
| `/verify-email` | Email verification status |
| `/privacy` | Privacy and cookie preferences |
| `/terms` | Terms of service |

## Technology

- Next.js App Router 16
- React 19 and TypeScript
- Tailwind CSS and PostCSS
- MongoDB with Mongoose
- NextAuth with credentials and Google providers
- Nodemailer for verification and password-reset email
- `bcryptjs` for password hashing
- `react-hook-form` and Zod for form handling and validation
- Motion and Lucide React for interaction and UI details

## Getting Started

### Prerequisites

- Node.js compatible with the versions supported by the installed Next.js release
- npm
- MongoDB for account and workspace features

### Install

```bash
npm ci
```

Create a local environment file at `.env.local` using the variables below, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

The application reads the following variables:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/metricores
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000

# Required for Google sign-in
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Required to send verification and password-reset email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

The email implementation also accepts the aliases `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM`. When SMTP is not configured during development, email links are logged instead of sent. Configure a real SMTP provider for production. Never commit `.env.local` or expose any secret to the client.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create a production build |
| `npm start` | Start the production server on port 3000 |
| `npm run lint` | Run the TypeScript compiler with `--noEmit` |
| `npx tsx --test tests/password-validation.test.ts` | Run the currently available password-validation test |

There is no dedicated `npm test` script at present.

## Authentication and Workspace

Credentials accounts are stored in MongoDB with bcrypt-hashed passwords. New credentials users must verify their email before signing in. Verification links expire after 24 hours; password-reset links expire after one hour. Verification and password-reset requests are rate-limited.

Google accounts are created or updated on first sign-in and are marked as verified. Sessions use NextAuth JWTs. Authenticated users can update profile details, manage passwords, save calculations, mark favorites, and review workspace history.

Guest calculator usage is tracked in browser `localStorage`. Authenticated workspace data is stored on the user document, with server-side caps for saved calculations and history. Client-only state also includes cookie preferences and scientific-calculator history.

## API Surface

### Authentication

- `GET|POST /api/auth/[...nextauth]` - NextAuth session and provider endpoints
- `POST /api/auth/signup` - Create a credentials account
- `GET /api/auth/verify-email?token=...` - Verify an email address
- `POST /api/auth/resend-verification` - Resend a verification link
- `POST /api/auth/forgot-password` - Request a password-reset link
- `POST /api/auth/reset-password` - Set a new password

### User Workspace

- `PUT /api/user/profile` - Update profile details
- `PUT /api/user/password` - Change or set a password
- `GET|POST|DELETE /api/user/workspace` - Read and mutate saved workspace data

## Project Structure

```text
app/                  Next.js routes, pages, layouts, and API handlers
components/           Shared views and calculator UI components
data/                 Calculator registry and static guide content
lib/                  Context, email, tokens, database connection, and models
utils/                Formatting, class-name, password, and math-parser utilities
tests/                Automated tests
types/                Global and NextAuth type extensions
```

The global providers are composed in [`app/layout.tsx`](app/layout.tsx). MongoDB connection and the user model are defined in [`lib/db/connect.ts`](lib/db/connect.ts) and [`lib/db/models/User.ts`](lib/db/models/User.ts).

## Important Notes

- Tax calculations are simplified estimates and are not tax advice.
- Financial calculators are planning aids; results do not include every lender, tax, insurance, fee, or jurisdiction-specific condition.
- No database migration or seed command is included. User data is created through the authentication and workspace APIs.
- The `lint` script currently performs TypeScript checking rather than ESLint.
- Production deployment requires secure `NEXTAUTH_SECRET`, a reachable MongoDB deployment, configured OAuth callback URLs, and working SMTP credentials.

## License

No license file is currently included in the repository. Confirm the intended distribution terms before publishing or redistributing the project.
