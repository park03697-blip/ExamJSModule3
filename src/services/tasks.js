// =====================================
// BASE SETTINGS
// =====================================
const BASE_URL = "http://localhost:3001";
const activeUser = JSON.parse(localStorage.getItem("session"));

// DOM REFERENCES
const tableBody = document.getElementById("taskTableBody");
const totalCountEl = document.getElementById("totalCount");
const pendingCountEl = document.getElementById("pendingCount");
const doneCountEl = document.getElementById("doneCount");
const progressRateEl = document.getElementById("progressRate");

// Redirect if no session
if (!activeUser) {
  window.location.href = "../../public/views/login.html";
}

// =====================================
// DATE FORMATTER
// =====================================
function prettyDate(rawDate) {
  if (!rawDate) return "—";

  const parsed = new Date(rawDate);
  if (isNaN(parsed)) return "—";

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// =====================================
// RENDER TASK TABLE
// =====================================
function paintTasks(list) {
  tableBody.innerHTML = "";

  if (list.length === 0) {
    tableBody.innerHTML =
      "<tr><td colspan='7'>No tasks available</td></tr>";
    return;
  }

  list.forEach((item) => {
    const row = document.createElement("tr");

    const toggleLabel =
      item.status === "completed" ? "Mark Pending" : "Mark Completed";

    row.innerHTML = `
      <td>${item.title}</td>

      <td class="truncate" title="${item.description || "No details"}">
        ${item.description || '<span class="muted">N/A</span>'}
      </td>

      <td>
        <span class="status-tag ${item.status}">
          ${item.status}
        </span>
      </td>

      <td>${item.category || "—"}</td>

      <td>
        <span class="priority-tag ${item.priority}">
          ${item.priority}
        </span>
      </td>

      <td>${prettyDate(item.dueDate)}</td>

      <td class="actions-col">
        <button onclick="switchStatus('${item.id}', '${item.status}')">
          ${toggleLabel}
        </button>

        <button onclick="renameTask('${item.id}', '${item.title}')">
          Edit
        </button>

        <button onclick="removeTask('${item.id}')">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// =====================================
// LOAD TASKS + METRICS
// =====================================
function fetchTasks() {
  fetch(`${BASE_URL}/tasks?userId=${activeUser.id}`)
    .then((res) => res.json())
    .then((taskList) => {
      const total = taskList.length;
      const done = taskList.filter((t) => t.status === "completed").length;
      const pending = taskList.filter((t) => t.status === "pending").length;

      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      totalCountEl.textContent = total;
      pendingCountEl.textContent = pending;
      doneCountEl.textContent = done;
      progressRateEl.textContent = `${progress}%`;

      paintTasks(taskList);
    })
    .catch(() => console.error("Error loading tasks"));
}

// =====================================
// FILTER CONTROLS
// =====================================
const filterChips = document.querySelectorAll(".filter-chip");

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const type = chip.dataset.filter;

    fetch(`${BASE_URL}/tasks?userId=${activeUser.id}`)
      .then((res) => res.json())
      .then((taskList) => {
        let filtered = taskList;

        if (type === "pending") {
          filtered = taskList.filter((t) => t.status === "pending");
        } else if (type === "completed") {
          filtered = taskList.filter((t) => t.status === "completed");
        }

        paintTasks(filtered);
      });
  });
});

// =====================================
// TOGGLE STATUS
// =====================================
function switchStatus(id, current) {
  const updated = current === "completed" ? "pending" : "completed";

  fetch(`${BASE_URL}/tasks/${id}`)
    .then((res) => res.json())
    .then((task) => {
      const payload = { ...task, status: updated };

      return fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    })
    .then(fetchTasks)
    .catch(() => alert("Error updating task status"));
}

// =====================================
// EDIT TASK TITLE
// =====================================
function renameTask(id, oldTitle) {
  const newTitle = prompt("Update task title:", oldTitle);

  if (!newTitle || newTitle === oldTitle) return;

  fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Update failed");
      fetchTasks();
    })
    .catch(() => alert("Error editing task"));
}

// =====================================
// DELETE TASK
// =====================================
function removeTask(id) {
  const confirmDelete = confirm("Delete this task permanently?");

  if (!confirmDelete) return;

  fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  })
    .then(fetchTasks)
    .catch(() => alert("Error deleting task"));
}

// Expose globally
window.switchStatus = switchStatus;
window.renameTask = renameTask;
window.removeTask = removeTask;

// =====================================
// INITIAL LOAD
// =====================================
fetchTasks();
