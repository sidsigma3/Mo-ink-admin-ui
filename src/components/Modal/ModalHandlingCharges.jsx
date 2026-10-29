import React, { useEffect, useState } from "react";
import "./ModalConfirmOrder.css"; // shared overlay / box / button styles
import "./ModalHandlingCharges.css";

/**
 * Edits the two handling-charge rates (in-state and out-of-state) and saves them
 * as the defaults every app reads. `handlingRate` is the currently loaded config;
 * `onSave` receives the edited values and is expected to persist them.
 */
const ModalHandlingCharges = ({ isOpen, onCancel, onSave, handlingRate }) => {
  const [inStateRate, setInStateRate] = useState("");
  const [outOfStateRate, setOutOfStateRate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const homeState = handlingRate?.homeState || "Odisha";

  // Re-seed the fields from the live config each time the modal opens, so a
  // cancelled edit never leaves stale values behind.
  useEffect(() => {
    if (isOpen) {
      setInStateRate(String(handlingRate?.inStateRatePerKg ?? ""));
      setOutOfStateRate(String(handlingRate?.outOfStateRatePerKg ?? ""));
      setError("");
      setSaving(false);
    }
  }, [isOpen, handlingRate]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const parsedInState = parseFloat(inStateRate);
    const parsedOutOfState = parseFloat(outOfStateRate);

    if (Number.isNaN(parsedInState) || Number.isNaN(parsedOutOfState)) {
      setError("Both rates are required.");
      return;
    }

    if (parsedInState < 0 || parsedOutOfState < 0) {
      setError("Rates cannot be negative.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await onSave({
        inStateRatePerKg: parsedInState,
        outOfStateRatePerKg: parsedOutOfState,
      });
    } catch (err) {
      setError(
        err?.response?.data?.data?.message ||
        "Could not save the rates. Please try again."
      );
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onCancel} disabled={saving}>
          &times;
        </button>

        <div className="modal-icon brand">
          <span>&#8377;</span>
        </div>

        <h2 className="modal-title">Handling Charges</h2>
        <p className="modal-message">
          Charged per kg of order weight, based on the shipping state.
        </p>

        <div className="handling-rate-fields">
          <div className="handling-rate-field">
            <label htmlFor="inStateRate">
              Inside {homeState}
              <span className="hint">Applied when the shipping state is {homeState}</span>
            </label>
            <div className="handling-rate-input">
              <span className="prefix">&#8377;</span>
              <input
                id="inStateRate"
                type="number"
                min="0"
                step="0.01"
                value={inStateRate}
                onChange={(e) => setInStateRate(e.target.value)}
                disabled={saving}
              />
              <span className="suffix">per kg</span>
            </div>
          </div>

          <div className="handling-rate-field">
            <label htmlFor="outOfStateRate">
              Outside {homeState}
              <span className="hint">Applied to every other shipping state</span>
            </label>
            <div className="handling-rate-input">
              <span className="prefix">&#8377;</span>
              <input
                id="outOfStateRate"
                type="number"
                min="0"
                step="0.01"
                value={outOfStateRate}
                onChange={(e) => setOutOfStateRate(e.target.value)}
                disabled={saving}
              />
              <span className="suffix">per kg</span>
            </div>
          </div>
        </div>

        {error && <p className="handling-rate-error">{error}</p>}

        <p className="handling-rate-note">
          These rates apply to all new orders across the admin panel, the storefront
          and the mobile app. Orders already placed keep the charges they were created with.
        </p>

        <div className="modal-actions">
          <button className="bttn bttn-outline" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="bttn bttn-brand" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHandlingCharges;
