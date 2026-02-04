// =====================================
// SESSION & ACCESS CONTROL
// =====================================
const activeSession = JSON.parse(localStorage.getItem("session"));

// Redirect if no active session
if (!activeSession) {
  window.location.href = "../../public/views/login.html";
}

// Page role validation
const onAdminView = window.location.pathname.includes("admin.html");
const onTaskView = window.location.pathname.includes("tasks.html");

// Admin-only access
if (onAdminView && activeSession.role !== "admin") {
  window.location.href = "../../public/views/login.html";
}

// User-only access
if (onTaskView && activeSession.role !== "user") {
  window.location.href = "../../public/views/login.html";
}

// =====================================
// LOGOUT HANDLER
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  const exitButton = document.getElementById("logoutBtn");

  if (exitButton) {
    exitButton.addEventListener("click", () => {
      localStorage.removeItem("session");
      window.location.href = "../../public/views/login.html";
    });
  }
});
