// frontend/src/lib/axios.js
import axios from "axios";

/**
 * Lazily create axios instance to avoid module initialization / circular import issues.
 * Exports:
 *  - api (callable axios instance proxy)
 *  - default export (api)
 *  - axiosInstance (alias for backward compatibility)
 *  - API_BASE, SOCKET_BASE (strings)
 */

// compute bases directly from env (safe, no app imports here)
const API_RAW = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_BASE = API_RAW.replace(/\/$/, "");
export const SOCKET_BASE = API_BASE.replace(/\/api$/, "");

// internal real instance placeholder
let _realApi = null;

// helper to create the real axios instance
function createRealApi() {
  if (_realApi) return _realApi;

  const instance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });

  // Optional: attach token from localStorage if you ever use header tokens.
  instance.interceptors.request.use((config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  });

  _realApi = instance;
  return _realApi;
}

// Create a function proxy so api(...) (callable) and api.get/post/etc work transparently.
const apiHandler = {
  // for function call: api(config) or api(url, config)
  apply(target, thisArg, args) {
    const real = createRealApi();
    return real.apply(thisArg, args);
  },
  // for property access: api.get, api.post, etc.
  get(target, prop) {
    const real = createRealApi();
    const value = real[prop];
    // bind methods to the real instance if they are functions
    if (typeof value === "function") return value.bind(real);
    return value;
  },
  // allow setting properties on the proxy
  set(target, prop, value) {
    const real = createRealApi();
    real[prop] = value;
    return true;
  },
};

// a dummy function used as target for the proxy
function _dummy() {}

// the proxy that behaves like the axios instance but initializes lazily
export const api = new Proxy(_dummy, apiHandler);

// default export and alias for backwards compatibility
export default api;
export const axiosInstance = api;
