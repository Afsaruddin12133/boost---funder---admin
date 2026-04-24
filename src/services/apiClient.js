const BASE_URL = import.meta.env.VITE_BASE_URL;


const buildUrl = (path) => {
  if (!BASE_URL) {
    throw new Error("Missing VITE_BASE_URL. Check your .env values.");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
};

const request = async (path, options = {}) => {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const baseHeaders = isFormData ? {} : { "Content-Type": "application/json" };

  const response = await fetch(buildUrl(path), {
    headers: {
      ...baseHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  

  if (!response.ok || data?.success === false) {
    const message =
      data?.message ||
      data?.error ||
      data?.error?.message ||
      data?.data?.message ||
      (typeof data === "string" ? data : null) ||
      response.statusText ||
      "Request failed. Please try again.";
    throw new Error(message);
  }

  return data;
};

const apiClient = {
  request,
};

export default apiClient;
