// SRP: Manages timed flash/notification state — nothing else.

import { useState } from "react";

export function useFlash(durationMs = 3500) {
  const [flash, setFlash] = useState(null);

  const showFlash = (msg, ok = true) => {
    setFlash({ msg, ok });
    setTimeout(() => setFlash(null), durationMs);
  };

  return { flash, showFlash };
}
