const API_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:5003";

async function request(path, options = {}) {
  const url = new URL(`${API_URL}${path}`);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "string" ? payload : payload.message;
    throw new Error(message || "Something went wrong");
  }

  return payload;
}

export const api = {
  getStats: () => request("/api/dashboard/stats"),
  getMembers: (query) => request("/api/members", { query }),
  getMember: (id) => request(`/api/members/${id}`),
  createMember: (body) => request("/api/members", { method: "POST", body }),
  updateMember: (id, body) => request(`/api/members/${id}`, { method: "PUT", body }),
  deleteMember: (id) => request(`/api/members/${id}`, { method: "DELETE" }),
  getPlans: () => request("/api/plans"),
  createPlan: (body) => request("/api/plans", { method: "POST", body }),
  updatePlan: (id, body) => request(`/api/plans/${id}`, { method: "PUT", body }),
  deletePlan: (id) => request(`/api/plans/${id}`, { method: "DELETE" })
};
