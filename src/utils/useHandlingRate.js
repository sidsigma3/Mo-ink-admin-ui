import { useEffect, useState } from "react";
import { fetchHandlingRate, FALLBACK_HANDLING_RATE } from "../services/SettingsService";

/**
 * Handling-charge rates configured for every app, loaded once per mount so a rate
 * change takes effect without a redeploy. Starts on the fallback rates so totals
 * never render blank while the request is in flight. The setter lets a screen show
 * a rate it has just saved without refetching.
 */
const useHandlingRate = () => {
  const [handlingRate, setHandlingRate] = useState(FALLBACK_HANDLING_RATE);

  useEffect(() => {
    let cancelled = false;

    fetchHandlingRate().then((rate) => {
      if (!cancelled) setHandlingRate(rate);
    });

    return () => { cancelled = true; };
  }, []);

  return [handlingRate, setHandlingRate];
};

export default useHandlingRate;
