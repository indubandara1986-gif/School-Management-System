// SRP: All HTTP communication in one place.
// DIP: Components depend on these abstractions, not on fetch() directly.

const API = "http://localhost/vidyaloka/api.php";

async function api(action, method = "GET", body = null, params = {}) {
  const url = new URL(API);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== null && v !== undefined) url.searchParams.set(k, v);
  });
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  return res.json();
}

export const get  = (action, params = {})  => api(action, "GET",    null, params);
export const post = (action, body   = {})  => api(action, "POST",   body);
export const del  = (action, body   = {})  => api(action, "DELETE", body);
