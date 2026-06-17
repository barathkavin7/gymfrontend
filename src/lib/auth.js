export function isAdmin() {
  if (typeof window === "undefined") return false;

  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");

  window.location.href = "/login";
}
