# Chitragupta AI

Chitragupta AI is an anomaly detection and monitoring platform for works
funded under the MPLADS (Members of Parliament Local Area Development Scheme).
It accepts CSV exports of work records, scores each row with trained
unsupervised ML models, and surfaces high-risk works on an interactive
dashboard for triage by MPs, District Magistrates, and Auditors.

## What is MPLADS?

MPLADS is a Central Sector Scheme of the Government of India under which each
Member of Parliament is allocated funds — currently INR 5 crore per year — to
recommend development works in their constituency. MPs recommend works; District
Authorities sanction, execute, and release payments. Because funds are
disbursed across hundreds of districts and thousands of works each financial
year, manual monitoring cannot realistically cover the full portfolio. The
specific failure modes this platform is designed to detect include cost
overruns (a work costing far more than peer works of the same type), premature
payments (money released ahead of the work's completion status), implausibly
fast completion (work marked done in days when similar works take months),
and vendor concentration (a single implementing agency absorbing a
disproportionate share of works in one state).

## Architecture at a glance

This repository is a Turborepo monorepo. Running the full local stack involves
three processes:

| Service | Directory | Role | Dev address |
|---|---|---|---|
| Dashboard | `apps/dashboard` | Vite + React 19 + TypeScript frontend | `http://localhost:3001` |
| Backend | `apps/backend` | Flask orchestration API — handles CSV upload, Supabase Storage writes, and per-row ML scoring calls | `http://127.0.0.1:5000` |
| ML API (optional) | `ChitraGupta_Ai_api` | Standalone Flask service — Isolation Forest inference only | `http://localhost:5000` |

In production, `apps/backend/` calls the deployed copy of `ChitraGupta_Ai_api/`
on Render rather than a local instance. You do not need to run
`ChitraGupta_Ai_api/` locally for normal frontend or backend development.

See [`ChitraGupta_Ai_api/README.md`](ChitraGupta_Ai_api/README.md) for a
detailed description of the ML service and how it relates to `apps/backend/`.

## The ML pipeline at a glance

The platform runs two independent unsupervised models against every work
record: an Isolation Forest (ISO) and a Local Outlier Factor (LOF). Neither
model requires labeled fraud data — each flags works that look statistically
unusual relative to their peer group. Because they use different geometric
assumptions, a work that both models flag independently is treated as a
stronger signal than one flagged by only one. The risk tier assignment follows
directly from that: when both models flag a work (`iso_flag == -1` and
`lof_flag == -1`) the work lands in the High tier; when only one flags it,
Medium; when neither flags it, Low. Both model signals, their raw decision
scores, and the five engineered features that drove the prediction travel with
every alert to the dashboard, making each result explainable. The Alerts page
displays the ISO and LOF flags side by side in separate columns so a reviewer
can immediately see which model (or both) flagged a given work. The scoring is
triggered row-by-row inside `apps/backend/routes/analysis.py` during CSV
upload; each row is forwarded to the ML API endpoint defined by the `ML_API_URL`
constant in that file.

## The five engineered features

Raw work fields are transformed into five numeric features before being passed
to either model. The formulas below are taken directly from
`engineer_features()` in `ChitraGupta_Ai_api/app.py`.

| Feature | Formula | What it detects |
|---|---|---|
| `cost_ratio` | `cost_estimate / median_cost(state, category)` | Inflated or underpriced costs relative to similar works in the same state and category |
| `completion_speed_ratio` | `completion_days / median_days(category)` | Implausibly fast completion or excessive delays relative to category norms |
| `vendor_concentration` | `agency_work_count / state_avg_agency_load` | One implementing agency absorbing a disproportionate share of works in a state |
| `payment_mismatch` | `max(payment_released_pct - expected_payment_for_status, 0) * 2` | Payments released ahead of (or far behind) what the work's status warrants |
| `cost_estimate` | raw rupee value | Anchors the anomaly signal to real monetary scale |

The expected payment per status is: Sanctioned = 0.10, In Progress = 0.50,
Completed = 1.00 (from `STATUS_EXPECTED_PAYMENT` in `app.py`). A healthy
the anomaly score upward.

## Dashboard pages

### Overview (`/dashboard/overview`)

Four KPI cards (Total Sanctioned, Works Completed, High-Risk Cases, Avg Risk
Score) computed from the role-scoped dataset. Below: a 12-month line chart of
Expenditure vs Sanction Trend, a risk distribution donut (Low / Medium / High
percentages), and a bar chart of the top 5 states by average risk score. All
charts re-compute when the active role changes.

### Alerts (`/dashboard/alerts`)

Primary triage interface. Sortable, paginated table (default: risk score
descending) with severity filter and text search. Each row shows a risk score
bar, an ISO flag column, and a LOF flag column. Clicking a row opens a
slide-over panel with project metadata, the four engineered feature values,
both model signals with raw decision scores, and Dismiss / Escalate actions.
A Model Validation banner shows the synthetic-anomaly catch rate for the
current dataset.

### Works (`/dashboard/works`)

Full catalog of all scored work records. Filters: severity, category, state.
Free-text search. Paginated and sortable. Contains the CSV upload zone:
uploading a file POSTs it to `http://127.0.0.1:5000/api/upload-csv`, which
validates columns, writes to Supabase Storage, calls the ML API per row, and
returns per-row risk scores plus a summary.

### Reports (`/dashboard/reports`)

Three tabs, each with a CSV export button:

- **Anomaly Types** — catch-rate breakdown by anomaly category (cost inflation,
  premature payment, suspiciously fast, vendor concentration).
- **MP-wise** — works, high-risk count, avg risk score, and total sanctioned
  per MP, sorted by work count.
- **State-wise** — same columns aggregated at state level.

All tabs respect the active role scope.

### Settings (`/dashboard/settings`)

Three adjustable compliance thresholds (number inputs + sliders):

- **Sanction Delay Threshold** — 15–90 days
- **Cost Overrun Ratio** — 1.0–3.0x
- **Tender Bypass Limit** — 5–50 lakh

A read-only Pipeline Configuration panel shows the ML parameters used at
training time (Isolation Forest contamination 0.05, LOF n\_neighbors 20, peer
group minimum size 10). Thresholds are stored locally; they do not affect the
server-side ML scoring.

## Role scopes

Managed by the `useRoleStore` Zustand store (`src/stores/useRoleStore.ts`);
applied to every query via `filterByRole()` in `src/lib/roleFilter.ts`.

| Identifier | Label | Scope |
|---|---|---|
| `MP` | Member of Parliament | Constituency — rows where `mp_name` matches the active MP |
| `DM` | District Magistrate | State — rows where `state` matches the active state |
| `AUDITOR` | Auditor | National — all records |
| `ADMIN` | System Admin | National — all records |

In the current build the `MP` and `DM` scope values are pre-seeded constants
in `roleFilter.ts`.

## Work record schema

### Required at upload

These columns must be present in every uploaded CSV row
(`RAW_REQUIRED_FIELDS` in `apps/backend/routes/analysis.py`):

- `state`
- `work_category`
- `cost_estimate`
- `implementing_agency`
- `status`
- `payment_released_pct`

### Fields present in the scored output

The `AlertRow` interface in `apps/dashboard/src/data/mockAlerts.ts` documents
the full column set returned after ML scoring:

`work_id`, `state`, `mp_name`, `work_category`, `work_description`,
`cost_estimate`, `implementing_agency`, `sanction_date`, `completion_days`,
`payment_released_pct`, `status`, `is_synthetic_anomaly`, `anomaly_type`,
`cost_ratio`, `completion_days_filled`, `completion_speed_ratio`,
`vendor_concentration`, `expected_payment`, `payment_mismatch`,
`iso_flag`, `iso_score`, `lof_flag`, `lof_score`, `risk_level`, `risk_score`.

## Where the ML model lives

The standalone Flask ML service lives in [`ChitraGupta_Ai_api/`](ChitraGupta_Ai_api/README.md).
The identical code is deployed on Render as a persistent inference endpoint;
the URL is hardcoded in `apps/backend/routes/analysis.py` as the `ML_API_URL`
constant (line 22–24 of that file). During CSV upload, `apps/backend/`
calls that endpoint once per CSV row. Developers iterating on feature
engineering or the model itself should run the local copy and temporarily
update `ML_API_URL` to point at `http://localhost:5000/predict` during
development — do not commit that change.

## Prerequisites

- **Node.js** >= 22.12.0 (see `engines` in `package.json`)
- **pnpm** 12.4.2 (see `packageManager` in `package.json`)
- **Python** 3.12 (required for both Flask services)
- **uv** — fast Python package installer:
  [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)

## First-time setup

### Step 1 — Clone and install Node dependencies

```bash
git clone https://github.com/Swayam-Was-Here/chitragupta-ai.git
cd chitragupta-ai
pnpm install
```

### Step 2 — Configure environment variables

Copy both `.env.example` files to their real counterparts and fill in the
values from your Supabase project dashboard (Settings → API):

```bash
cp apps/dashboard/.env.example apps/dashboard/.env.local
cp apps/backend/.env.example apps/backend/.env
```

The exact key names for each service are listed in their respective example
files:

- [`apps/dashboard/.env.example`](apps/dashboard/.env.example) —
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- [`apps/backend/.env.example`](apps/backend/.env.example) —
  `SUPABASE_URL`, `SUPABASE_KEY`

Do not commit either `.env` or `.env.local`. Both are gitignored. Do not
include real Supabase keys in any committed file.

### Step 3 — Set up Python environments

Only required if you plan to run either Flask service locally.

**Backend (`apps/backend/`):**

```bash
cd apps/backend
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
deactivate
```

**Standalone ML API (`ChitraGupta_Ai_api/`) — optional:**

```bash
cd ../../ChitraGupta_Ai_api
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
```

The ML API also requires `isolation_forest_model.pkl` and
`feature_scaler.pkl` in the `ChitraGupta_Ai_api/` directory. These files are
not committed to the repo. Obtain them from the ML team before running this
service.

### Step 4 — Start the services

Open three terminal windows.

**Terminal 1 — Frontend (required):**

```bash
pnpm dev:dashboard
```

**Terminal 2 — Backend (required for the upload flow):**

```bash
cd apps/backend
source .venv/bin/activate
python app.py
```

**Terminal 3 — Standalone ML API (optional, for local ML iteration only):**

```bash
cd ChitraGupta_Ai_api
source .venv/bin/activate
python app.py
```

## Verifying the setup

After starting the services above, check the following manually:

- Open `http://localhost:3001` — the landing page renders.
- Open `http://localhost:3001/login` — the Sign In form is shown; log in with
  a valid Supabase user account.
- Open `http://localhost:3001/dashboard/overview` — KPI cards and charts
  render without errors.
- Open `http://localhost:3001/dashboard/works` — the CSV upload drop zone is
  visible.
- After uploading a CSV, the backend terminal shows a `POST /api/upload-csv`
  log entry.

## Repository layout

```
chitragupta-ai/
├── apps/
│   ├── dashboard/       # Vite + React 19 frontend
│   └── backend/         # Flask orchestration API
├── ChitraGupta_Ai_api/  # Standalone Flask ML API
├── packages/            # Shared packages (Turborepo)
├── pnpm-workspace.yaml
└── turbo.json
```

## Common scripts

Scripts defined in the root `package.json`:

| Script | Command run by Turbo |
|---|---|
| `pnpm build` | `turbo run build` — builds all packages |
| `pnpm dev` | `turbo run dev` — starts all dev servers |
| `pnpm dev:dashboard` | `turbo run dev --filter=dashboard` — starts only the frontend |
| `pnpm build:dashboard` | `turbo run build --filter=dashboard` — builds only the frontend |
| `pnpm lint` | `turbo run lint` |
| `pnpm test` | `turbo run test` |
| `pnpm format` | `prettier --write "**/*.{ts,tsx,md}"` |
| `pnpm check-types` | `turbo run check-types` |

## Development workflows

### Adding a shadcn/ui component

```bash
cd apps/dashboard
pnpm dlx shadcn@latest add <component-name>
```

Components land in `src/components/ui/` and are configured by
`components.json` (style: `base-vega`, icon library: `lucide`, aliases
resolved via `@/components/ui`). The design tokens in `src/index.css` are
applied automatically. Hand-editing generated component files is discouraged
because the shadcn CLI will overwrite them on the next `add` run.

### Adding a dashboard page

1. Create `apps/dashboard/src/pages/dashboard/<PageName>.tsx` and export a
   named function component.
2. Add a `<Route path="<page-name>" element={<PageName />} />` inside the
   existing `/dashboard` nested `<Route>` block in
   `apps/dashboard/src/App.tsx` (lines 71–86).
3. Add a nav entry to the `NAV_ITEMS` array in
   `apps/dashboard/src/components/dashboard/Sidebar.tsx` (line 16–22) with a
   `to`, `label`, and `Icon` from `lucide-react`.

## Troubleshooting

- **`supabaseUrl is required` error in the browser console** — the
  `apps/dashboard/.env.local` file is missing or was created after the Vite
  dev server started. Create the file and restart `pnpm dev:dashboard`.

- **`ModuleNotFoundError` for `flask`, `requests`, `pandas`, or similar** —
  the Python virtual environment for that service was not activated, or
  `uv pip install -r requirements.txt` was not run. Activate the correct
  `.venv` and re-run the install step.

- **CORS errors in the browser after uploading a CSV** — `apps/backend/` is
  not running, or it is not listening on `127.0.0.1:5000`. The frontend
  upload flow in `Works.tsx` is hardcoded to `http://127.0.0.1:5000/api/upload-csv`.
  Confirm the backend terminal is active and shows no startup errors.

- **404 on `POST /predict` when hitting `apps/backend/`** — the `/predict`
  route does not exist in `apps/backend/`. It is defined only in
  `ChitraGupta_Ai_api/app.py`. In normal operation, `apps/backend/` calls the
  deployed Render instance of the ML API at the URL set in `ML_API_URL`
  inside `apps/backend/routes/analysis.py`.

## Security notes

- `.env` and `.env.local` are gitignored. Never force-commit them with
  `git add -f`.
- `SUPABASE_KEY` in `apps/backend/.env` is the service-role secret key. It
  must never appear in frontend code or any committed file. If it is ever
  leaked or committed, rotate it immediately in the Supabase dashboard
  (Settings → API → Service Role Key → Regenerate).
- `VITE_SUPABASE_PUBLISHABLE_KEY` is the anon/publishable key. It is
  intentionally safe to ship in browser code.
- Do not add real secrets to any `.env.example` file. The example files are
  committed and serve only as templates with placeholder values.
- Push protection is enabled on this repository. GitHub will block any push
  containing a pattern that matches a recognized Supabase secret.

## Contributing

- Branch names: `feature/*`, `fix/*`, `chore/*`, `docs/*`
- Commit messages: use Conventional Commits prefixes — `feat:`, `fix:`,
  `chore:`, `docs:`
- Pull requests require one approval before merge

## Further reading

- [`ChitraGupta_Ai_api/README.md`](ChitraGupta_Ai_api/README.md) — the
  standalone ML API: endpoints, engineered features, model files, known
  limitations
- [`apps/dashboard/README.md`](apps/dashboard/README.md) — the frontend
  application
- [`apps/backend/app.py`](apps/backend/app.py) — the orchestration API entry
  point
- Your Supabase project dashboard — source of truth for all API keys and
  storage bucket configuration