# ChitraGupta_Ai_api — Standalone ML API

This directory contains a small Flask service that is separate from the main
orchestration layer in `apps/backend/`. It loads a trained Isolation Forest
model (`isolation_forest_model.pkl`) and a feature scaler
(`feature_scaler.pkl`), engineers five numeric features from raw MPLADS work
data, and returns a risk score plus an anomaly flag via `POST /predict`. The
same code is deployed on Render and is called by `apps/backend/` in production
via the `ML_API_URL` constant.

## What problem does this solve?

MPLADS distributes development funds across hundreds of districts and tens of
thousands of individual works per financial year. The volume and geographic
spread of this activity make manual compliance review impractical. Supervised
fraud detection is also impractical because labeled fraud cases in this domain
are rare and often unconfirmed. Unsupervised anomaly detection is the
appropriate tool: the models flag works that are statistically unusual relative
to peer works of the same type, without requiring a prior definition of what
fraud looks like. The output is a ranked triage queue, not a conviction.

## What this is NOT

This folder is **not** `apps/backend/`. `apps/backend/` is the Flask
orchestration service that handles Supabase authentication verification, CSV
upload ingestion, Supabase Storage writes, and row-by-row calls to this ML
API. Do not confuse the two. When you run `apps/backend/` locally, it calls
the deployed Render instance of this service — you do not need to run
`ChitraGupta_Ai_api/` locally for normal frontend or backend development.

## When to run this locally

- Iterating on feature engineering logic or retraining the Isolation Forest
  model
- Debugging a specific prediction end-to-end without hitting the deployed
  Render instance
- Testing the full upload pipeline offline

## When NOT to run this locally

Normal frontend or backend development does not require this service. The
`apps/backend/` orchestration layer is configured to call the deployed Render
instance. You do not need to run `ChitraGupta_Ai_api/` for any of that work.

## The five engineered features

Raw work fields are transformed into five numeric features by `engineer_features()`
in `app.py`. The formulas below are taken directly from that function.

| Feature | Formula (from `app.py`) | Typical healthy value | High-side signal |
|---|---|---|---|
| `cost_ratio` | `cost_estimate / median_cost(state, category)` | ~1.0 (global median cost: ~9.77 lakh) | >> 1.0 — work costs far more than peer group |
| `completion_speed_ratio` | `completion_days / median_days(category)` | ~1.0 (global median: 178 days) | >> 1.0 — excessive delay; << 1.0 — implausibly fast |
| `vendor_concentration` | `agency_work_count / state_avg_agency_load` | ~1.0 (global avg load: ~4.5 works/agency) | >> 1.0 — single agency dominates a state |
| `payment_mismatch` | `max(payment_released_pct - expected_payment_for_status, 0) * 2` | 0.0 for on-schedule payment | > 0 — money released ahead of status milestone |
| `cost_estimate` | raw rupee value (no normalization) | varies by category | very large values anchor anomaly to real monetary scale |

The `expected_payment` per status is fixed at: Sanctioned = 0.10,
In Progress = 0.50, Completed = 1.00 (from `STATUS_EXPECTED_PAYMENT` in
`app.py`). If `completion_days` is absent from the input, the function
substitutes the category median from `reference_stats.json`.

## How peer groups work

The model does not compare a work to a national average. Each work is compared
to works of the same state and category via lookup tables precomputed at
training time and stored in `reference_stats.json`. The top-level keys of
that file are: `cost_median_by_state_category` (keyed as
`"state||category"`), `days_median_by_category`, `agency_work_counts`,
`state_avg_agency_load`, `global_median_cost`, `global_median_days`, and
`global_avg_agency_load`. When a state-category combination is not found
(for example, a new type of work in a small state), the feature computation
falls back to the global median for that dimension. This makes the model
robust to sparse peer groups but also means novel combinations receive less
precise context; see Known Limitations below.

## Endpoints

### `GET /`

Health check. Returns `{"message": "Isolation Forest ML API is running", "endpoint": "/predict", "expected_fields": [...]}`. Use to confirm the service started.

### `POST /predict`

Runs feature engineering and returns an anomaly prediction.

**Required fields** (derived from `RAW_REQUIRED_FIELDS` in `app.py`):

| Field | Type |
|---|---|
| `state` | string |
| `work_category` | string |
| `cost_estimate` | number |
| `implementing_agency` | string |
| `status` | string |
| `payment_released_pct` | number |

**Optional fields:**

| Field | Type | Behaviour when absent |
|---|---|---|
| `completion_days` | number | Falls back to category median from training data |

**Example request:**

```json
{
  "state": "Maharashtra",
  "work_category": "Road Construction",
  "cost_estimate": 1500000,
  "implementing_agency": "PWD",
  "status": "In Progress",
  "payment_released_pct": 0.9,
  "completion_days": 400
}
```

**Example response:**

```json
{
  "risk_score": 72.4,
  "is_anomaly": true,
  "engineered_features": {
    "cost_ratio": 1.312,
    "completion_speed_ratio": 1.084,
    "vendor_concentration": 2.175,
    "payment_mismatch": 0.800,
    "cost_estimate": 1500000.000
  }
}
```

The five engineered features correspond to the order declared in
`feature_columns.json`:
`cost_ratio`, `completion_speed_ratio`, `vendor_concentration`,
`payment_mismatch`, `cost_estimate`.

## Model files required at runtime

`app.py` loads four files at import time:

- `isolation_forest_model.pkl` — serialized Scikit-learn `IsolationForest`
  instance. Not committed. Obtain from the ML team.
- `feature_scaler.pkl` — fitted `StandardScaler` that normalizes the five
  features to zero mean and unit variance before scoring. Not committed.
- `feature_columns.json` — feature order expected by the model (committed).
- `reference_stats.json` — peer-group lookup tables (committed).

The `scikit-learn` version at load time must match the version used at
training time (see `requirements.txt`). A mismatch raises a version warning
or `KeyError`. Retraining produces new `.pkl` files; both must be updated
together and redeployed.

## Running locally with uv

Prerequisite: Python 3.12 or newer (the `requirements.txt` does not pin a
minor version, but the model files were produced with Python 3.12).

```bash
cd ChitraGupta_Ai_api
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
python app.py
```

The service binds to `0.0.0.0:5000` (set at the bottom of `app.py`).

## Testing a single prediction with curl

After starting the service locally, test it with the minimal required payload:

```bash
curl -s -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Maharashtra",
    "work_category": "Drainage system",
    "cost_estimate": 2500000,
    "implementing_agency": "PWD",
    "status": "In Progress",
    "payment_released_pct": 0.95
  }' | python3 -m json.tool
```

Expected response shape:

```json
{
  "risk_score": 65.3,
  "is_anomaly": true,
  "engineered_features": {
    "cost_ratio": 1.42,
    "completion_speed_ratio": 1.00,
    "vendor_concentration": 1.83,
    "payment_mismatch": 0.90,
    "cost_estimate": 2500000.0
  }
}
```

Field names in the request body must exactly match `RAW_REQUIRED_FIELDS` in
`app.py`. The response values will vary depending on the model version.

## Relationship to apps/backend/

|  | `apps/backend/` | `ChitraGupta_Ai_api/` |
|---|---|---|
| Purpose | Orchestration + CSV upload | ML scoring only |
| Binds to port | 5000 (Flask default, `debug=True`) | 5000 (`host="0.0.0.0"`) |
| Reads env vars | `SUPABASE_URL`, `SUPABASE_KEY` | none |
| Model files | none | `isolation_forest_model.pkl`, `feature_scaler.pkl` |
| Called by | Frontend upload flow (`/api/upload-csv`) | `apps/backend/` (as `ML_API_URL`) |
| Deployed to | TBD | Render |

> **Note:** Both services default to port 5000. If you run both locally at the
> same time, one will fail to bind. Use a different port for one of them.

## Known limitations

- **Cold-start for new implementing agencies.** An agency appearing in the
  dataset for the first time has no work-count history in `reference_stats.json`.
  The `agency_work_counts` lookup returns a default of 1, making
  `vendor_concentration` neutral for that agency. Shell agencies can therefore
  be under-flagged until enough historical data accumulates.

- **Small peer groups.** If a state-category combination has few works, its
  median in `cost_median_by_state_category` is computed from a small sample
  and is statistically fragile. Unusual-looking works in small states or
  niche categories may produce misleading `cost_ratio` values.

- **No temporal modeling.** Each work is scored as an independent record.
  Patterns that only emerge across time — such as a surge of "Completed" works
  just before the fiscal year end, or recurring anomalies from the same agency
  across multiple years — are not detected by this pipeline.

- **No real-world fraud validation.** The pipeline surfaces statistical
  outliers as a triage aid. It does not claim a specific precision or recall
  against real-world fraud cases, because no labeled fraud ground truth exists
  in this dataset. The catch-rate metric shown on the Alerts page measures
  performance against synthetically injected anomalies, not against confirmed
  fraud.
