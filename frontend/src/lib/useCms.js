import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "";

/**
 * useCms
 * --------
 * Fetches a public CMS endpoint and returns { data, loading }. Falls back
 * to the given `fallback` value immediately (no loading flash on a fast
 * connection, no blank section) and while the request is in flight; if the
 * request fails (API down, still deploying, etc.) it silently keeps the
 * fallback rather than breaking the page - the CMS makes content editable,
 * it shouldn't make the site fragile to the backend being briefly
 * unavailable.
 *
 *   const { data: services } = useCms("/api/services", copy.services);
 */
export function useCms(path, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}${path}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
      .then((json) => { if (!cancelled) setData(json); })
      .catch(() => { /* keep fallback */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, loading };
}
