from flask import Flask, request, jsonify
import joblib
import json
import numpy as np

app = Flask(__name__)

# Load trained model, scaler, feature order, and reference stats (all from training)
model = joblib.load("isolation_forest_model.pkl")
scaler = joblib.load("feature_scaler.pkl")

with open("feature_columns.json", "r") as f:
    FEATURES = json.load(f)

with open("reference_stats.json", "r") as f:
    REF = json.load(f)

STATUS_EXPECTED_PAYMENT = {'Sanctioned': 0.1, 'In Progress': 0.5, 'Completed': 1.0}

RAW_REQUIRED_FIELDS = [
    'state', 'work_category', 'cost_estimate',
    'implementing_agency', 'status', 'payment_released_pct'
]
# completion_days is optional — falls back to category median if missing


def engineer_features(raw):
    """Takes raw work data and computes the 5 model features using saved reference stats."""

    state = raw['state']
    category = raw['work_category']
    cost = float(raw['cost_estimate'])
    agency = raw['implementing_agency']
    status = raw['status']
    payment_pct = float(raw['payment_released_pct'])
    completion_days = raw.get('completion_days')

    # --- cost_ratio ---
    key = f"{state}||{category}"
    median_cost = REF['cost_median_by_state_category'].get(key, REF['global_median_cost'])
    cost_ratio = cost / median_cost if median_cost else 1.0

    # --- completion_speed_ratio ---
    days_filled = float(completion_days) if completion_days is not None else REF['global_median_days']
    category_median_days = REF['days_median_by_category'].get(category, REF['global_median_days'])
    completion_speed_ratio = days_filled / category_median_days if category_median_days else 1.0

    # --- vendor_concentration ---
    agency_count = REF['agency_work_counts'].get(agency, 1)
    state_avg_agency = REF['state_avg_agency_load'].get(state, REF['global_avg_agency_load'])
    vendor_concentration = agency_count / state_avg_agency if state_avg_agency else 1.0

    # --- payment_mismatch ---
    expected_payment = STATUS_EXPECTED_PAYMENT.get(status, 0.5)
    payment_mismatch = max(payment_pct - expected_payment, 0) * 2

    return {
        'cost_ratio': cost_ratio,
        'completion_speed_ratio': completion_speed_ratio,
        'vendor_concentration': vendor_concentration,
        'payment_mismatch': payment_mismatch,
        'cost_estimate': cost
    }


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Isolation Forest ML API is running",
        "endpoint": "/predict",
        "expected_fields": RAW_REQUIRED_FIELDS + ["completion_days (optional)"]
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        missing = [f for f in RAW_REQUIRED_FIELDS if f not in data]
        if missing:
            return jsonify({"error": "Missing fields", "missing": missing}), 400

        engineered = engineer_features(data)

        X = np.array([[engineered[f] for f in FEATURES]], dtype=float)
        X_scaled = scaler.transform(X)

        score = -model.decision_function(X_scaled)[0]
        flag = model.predict(X_scaled)[0]

        return jsonify({
            "risk_score": round(float(score) * 100, 1),
            "is_anomaly": bool(flag == -1),
            "engineered_features": {k: round(v, 3) for k, v in engineered.items()}
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)