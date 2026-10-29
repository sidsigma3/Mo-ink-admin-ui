import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL + '/settings';

/**
 * Rates used while the configured ones are loading, or if they cannot be loaded.
 * Mirrors the backend's seeded default — a flat ₹5/kg inside and outside the home
 * state — so a failed request never changes what an order is charged.
 */
export const FALLBACK_HANDLING_RATE = {
  inStateRatePerKg: 5,
  outOfStateRatePerKg: 5,
  homeState: "Odisha",
};

/** Roles the backend lets change the rates; everyone else sees them read-only. */
export const HANDLING_RATE_EDITOR_ROLES = ["MASTER", "ADMIN"];

const isValidRate = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;

export const fetchHandlingRate = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/handling-rate`);
    const rate = response.data?.data;

    if (!isValidRate(rate?.inStateRatePerKg) || !isValidRate(rate?.outOfStateRatePerKg)) {
      console.error("Unusable handling rate from backend, falling back to defaults:", rate);
      return FALLBACK_HANDLING_RATE;
    }

    return rate;
  } catch (error) {
    console.error("Error fetching handling rate, falling back to defaults:", error);
    return FALLBACK_HANDLING_RATE;
  }
};

export const updateHandlingRate = async (handlingRate) => {
  try {
    const response = await axios.put(`${BASE_URL}/handling-rate`, handlingRate);
    return response.data;
  } catch (error) {
    console.error("Error updating handling rate:", error);
    throw error;
  }
};

/**
 * Rupees-per-kg that applies to a given shipping state.
 * Falls back to the out-of-state rate when the state cannot be determined,
 * so an unparseable address never silently produces a zero charge.
 */
export const resolveRatePerKg = (shippingState, handlingRate) => {
  const rate = handlingRate || FALLBACK_HANDLING_RATE;
  const normalisedState = (shippingState || "").trim().toLowerCase();
  const homeState = (rate.homeState || "").trim().toLowerCase();

  return normalisedState && normalisedState === homeState
    ? Number(rate.inStateRatePerKg)
    : Number(rate.outOfStateRatePerKg);
};
