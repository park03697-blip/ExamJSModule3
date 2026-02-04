// =====================================
// BASE CONFIGURATION
// =====================================
const SERVER_URL = "http://localhost:3001";
const activeUser = JSON.parse(localStorage.getItem("session"));

// Redirect if no session
if (!activeUser) {
  window.location.href = "../../public/views/login.html";
}

// =====================================
// FORM REFERENCE
// =====================================
const creatorForm = document.getElementById("taskCreatorForm");

// =====================================
// FORM SUBMISSION HANDLER
// =====================================
creatorForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskPayload = {
    title: creatorForm.taskName.value.trim(),
    category: creatorForm.taskArea.value.trim(),
    priority: creatorForm.taskLevel.value,
    status: creatorForm.taskState.value,
    dueDate: creatorForm.taskDeadline.value,
    description: creatorForm.taskNotes.value.trim(),
    userId: activeUser.id,
  };

  fetch(`${SERVER_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskPayload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to create task");
      window.location.href = "./tasks.html";
    })
    .catch(() => alert("Error creating task"));
}); 