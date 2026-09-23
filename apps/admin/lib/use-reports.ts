"use client";

import { useCallback, useEffect, useState } from "react";
import { getReports } from "./api";
import type { Report } from "./model";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true); else setLoading(true);
    setError("");
    try { setReports(await getReports()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "تعذر تحميل البلاغات."); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    let active = true;
    getReports().then(data => { if (active) setReports(data); })
      .catch(cause => { if (active) setError(cause instanceof Error ? cause.message : "تعذر تحميل البلاغات."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { reports, loading, refreshing, error, refresh };
}
