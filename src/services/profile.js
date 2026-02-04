// =====================================
// SESSION & API CONFIG
// =====================================
const activeUser = JSON.parse(localStorage.getItem("session"));
const BASE_URL = "http://localhost:3001";

// DOM REFERENCES
const nameField = document.getElementById("detailName");
const headerName = document.getElementById("mainUserName");
const badgeRole = document.getElementById("mainUserBadge");
const roleField = document.getElementById("detailRole");
const emailField = document.getElementById("mainUserEmail");
const taskCounter = document.getElementById("assignedCount");
const editButton = document.querySelector(".btn-edit");

// =====================================
// INITIAL PROFILE LOAD
// =====================================
function loadProfile() {
  if (!activeUser) return;

  // Fill session data
  nameField.textContent = activeUser.name;
  headerName.textContent = activeUser.name;
  emailField.textContent = activeUser.email;

  // Role indicators
  badgeRole.textContent = activeUser.role;
  if (roleField) {
    roleField.textContent = activeUser.role;
  }

  // Load task count
  fetch(`${BASE_URL}/tasks?userId=${activeUser.id}`)
    .then((res) => res.json())
    .then((taskList) => {
      taskCounter.textContent = taskList.length;
    })
    .catch(() => console.error("Error loading tasks"));
}

// =====================================
// EDIT MODE HANDLER
// =====================================
editButton.addEventListener("click", () => {
  const isSaving = editButton.textContent.includes("Save");

  if (isSaving) {
    updateProfile();
  } else {
    const currentName = nameField.textContent;

    nameField.innerHTML = `
      <input 
        type="text" 
        id="editNameInput" 
        value="${currentName}" 
        style="padding: 6px; border-radius: 4px; border: 1px solid #2563EB; width: 100%; font-weight: 600;"
      >
    `;

    editButton.textContent = "💾 Save";
  }
});

// =====================================
// SAVE UPDATED PROFILE
// =====================================
function updateProfile() {
  const editedName = document.getElementById("editNameInput").value.trim();
  if (!editedName) return;

  fetch(`${BASE_URL}/users/${activeUser.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: editedName }),
  })
    .then((res) => res.json())
    .then((updated) => {
      const refreshedSession = { ...activeUser, name: updated.name };
      localStorage.setItem("session", JSON.stringify(refreshedSession));

      nameField.textContent = updated.name;
      headerName.textContent = updated.name;

      editButton.textContent = "✏️ Edit";
    })
    .catch(() => alert("Error updating profile"));
}

// Initialize
loadProfile();
