# Metricores

> A focused calculator workspace for faster, clearer everyday decisions.

Metricores brings practical finance, business, time, mathematics, and graphing tools into one responsive web experience. Each calculator is designed to turn a small set of inputs into an understandable result, with formulas, examples, and FAQs that help users make sense of the output.

The product supports both quick, no-account calculations and a signed-in workspace for people who want to save results, revisit previous work, and build a repeatable calculation workflow.

## Product Positioning

Most calculator sites are built around isolated one-off tools. Metricores is structured as a reusable calculation workspace:

- **Fast to use:** focused input flows with immediate, readable results
- **Easy to understand:** formulas, worked examples, and contextual FAQs accompany the calculation
- **Broad enough for real work:** financial, operational, scientific, and graphing tools share one product surface
- **Ready for repeat use:** authenticated users can keep saved calculations, favorites, recent tools, and workspace history
- **Accessible from anywhere:** responsive layouts support desktop and mobile workflows

## Product Modules

### Calculator Workspace

The core directory includes 16 calculators for financial planning, business analysis, mathematics, and everyday decisions.

| Area | Included tools |
| --- | --- |
| Mathematics | Scientific, Graphing, Percentage |
| Personal finance | Mortgage, Reverse Mortgage, Loan, Interest, Payment, ROI, Discount, Tip, VAT |
| Business analysis | Profit Margin |
| Planning and everyday | Tax, Time, Age |

The scientific calculator supports DEG/RAD modes, trigonometric and logarithmic functions, exponentials, factorials, memory operations, keyboard input, and local history. The graphing calculator supports multiple expressions, real-time parsing, pan and zoom, grid and axis controls, presets, themes, fullscreen mode, and downloadable output.

The Age Calculator calculates exact age in calendar-aware years, months, and days, including leap years, February 29 birthdays, month-end dates, next birthday timing, and total elapsed time.

The Reverse Mortgage Calculator provides an illustrative estimate of home equity, potential proceeds, balance growth, interest accumulation, repayment balance, and remaining equity. It is not a lender quote or financial advice; actual reverse mortgage products use program-specific eligibility, fees, insurance, limits, and underwriting.

### Guides and Education

Calculator pages include formula explanations, worked examples, and FAQs. The guides area extends that experience with practical strategy content so users can understand the decision behind a number, not only the number itself.

### Account and Workspace

Users can start as guests and move to an account when they need continuity. Registered users can:

- Save calculations and calculation history
- Mark calculators as favorites
- Review recently used calculators
- Update profile and security settings
- Sign in with email credentials or Google

Email verification and password recovery are included for credentials-based accounts.

## Product Preview

The repository does not currently include committed screenshot assets. The recommended documentation structure is:

```text
docs/
└── screenshots/
    ├── home-dashboard.png
    ├── calculator-workspace.png
    ├── graphing-calculator.png
    └── account-workspace.png
```

When product screenshots are added, this section can be extended with the following views:

| View | What it should demonstrate |
| --- | --- |
| Home dashboard | Calculator discovery and the primary product experience |
| Calculator workspace | Input, result, formula, example, and FAQ flow |
| Graphing calculator | Expression entry, plotted output, and interactive controls |
| Account workspace | Saved calculations, history, favorites, and profile controls |

## Why Metricores

Metricores is designed for users who need more confidence than a bare result field provides, without the friction of a heavyweight spreadsheet or specialized finance application.

- **For individuals:** estimate payments, taxes, tips, discounts, interest, and returns
- **For small teams:** standardize quick business calculations such as margin, ROI, VAT, and payment planning
- **For learners:** connect results to formulas, examples, and plain-language explanations
- **For repeat workflows:** save the calculations and tools that matter most

## Technology and Architecture

| Layer | Implementation |
| --- | --- |
| Application | Next.js App Router 16, React 19, TypeScript |
| UI | Tailwind CSS, Motion, Lucide React, Sonner |
| Forms and validation | React Hook Form and Zod |
| Authentication | NextAuth with credentials and Google providers |
| Data | MongoDB with Mongoose |
| Email | Nodemailer for verification and password recovery |
| Security | `bcryptjs` password hashing, expiring token flows, rate limits |

The application is organized around a registry-driven calculator model. General calculators are defined and dispatched from [`data/calculators.ts`](data/calculators.ts). The scientific experience lives in [`components/calculator/ScientificCalculator.tsx`](components/calculator/ScientificCalculator.tsx), while graph expressions are parsed by [`utils/mathParser.ts`](utils/mathParser.ts) and rendered by [`components/GraphingView.tsx`](components/GraphingView.tsx).

```text
app/                  Product routes, layouts, and API handlers
components/           Shared product views and calculator UI
data/                 Calculator registry and guide content
lib/                  App context, email, tokens, database, and models
utils/                Formatting, validation, and math utilities
tests/                Automated tests
types/                Global and NextAuth type extensions
```

## Application Routes

| Route | Product surface |
| --- | --- |
| `/` | Home dashboard and calculator discovery |
| `/calculators` | Full calculator directory |
| `/calculators/[id]` | Individual calculator workspace |
| `/guides` | Strategy and educational guides |
| `/about` | Product information |
| `/faq` | Frequently asked questions |
| `/auth` | Sign in, sign up, and Google sign-in |
| `/profile` | Profile, security, favorites, history, and saved workspace |
| `/forgot-password` | Password-reset request |
| `/reset-password?token=...` | Password-reset completion |
| `/verify-email` | Email verification status |
| `/privacy` | Privacy and cookie preferences |
| `/terms` | Terms of service |

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

## Local Development

### Prerequisites

- Node.js compatible with the installed Next.js release
- npm
- MongoDB for authentication and workspace features

### Installation

```bash
npm ci
```

Create `.env.local` in the project root, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
MONGODB_URI=mongodb://127.0.0.1:27017/metricores
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000

# Google sign-in
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Verification and password-reset email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

The email implementation also accepts `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM`. Without SMTP configuration in development, email links are logged instead of sent. Keep `.env.local` private and never expose secrets to the client.

### Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create a production build |
| `npm start` | Start the production server on port 3000 |
| `npm run lint` | Run TypeScript validation with `tsc --noEmit` |
| `npx tsx --test tests/password-validation.test.ts` | Run the available password-validation test |

## Deployment Readiness

For a production deployment, configure:

1. A managed MongoDB deployment and production `MONGODB_URI`
2. A strong, private `NEXTAUTH_SECRET`
3. The public application URL in `NEXTAUTH_URL`
4. Valid Google OAuth credentials and production callback URLs, if Google sign-in is enabled
5. A working SMTP provider for verification and password-reset email
6. HTTPS and secure secret management through the hosting platform

No deployment manifest, database migration system, or seed command is currently included. User records are created through the authentication flow and workspace data is created through the application APIs.

## Security and Data Behavior

- Credentials passwords are hashed with bcrypt before storage.
- Email verification tokens expire after 24 hours.
- Password-reset tokens expire after one hour.
- Verification and password-reset requests are rate-limited.
- Guest usage, cookie preferences, and scientific-calculator history use browser `localStorage`.
- Authenticated workspace data is stored with the user record and capped to prevent unbounded history growth.

## Roadmap

The current foundation supports the following natural product extensions:

- Add a curated screenshot gallery and product demo assets
- Expand calculator coverage based on user demand
- Add richer amortization and export workflows
- Introduce shared calculation templates for teams
- Add automated browser coverage for core calculator and authentication journeys
- Add production deployment automation, migrations, and seed data where needed

## Important Product Notes

Tax calculations are simplified estimates and are not tax advice. Financial outputs are planning aids and may not include every lender, fee, tax, insurance, or jurisdiction-specific condition. Users should verify material financial decisions with an appropriate professional.

## License

No license file is currently included. Confirm the intended distribution terms before publishing or redistributing the project.