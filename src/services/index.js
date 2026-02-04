// =====================================
// SESSION CHECK & REDIRECTION
// =====================================
const activeUser = JSON.parse(localStorage.getItem("session"));

// No session → send to login
if (!activeUser) {
  window.location.href = "../../public/views/login.html";
}

// Redirect based on role
else {
  const destination =
    activeUser.role === "admin"
      ? "../../public/views/admin.html"
      : "../../public/views/tasks.html";

  window.location.href = destination;
}
