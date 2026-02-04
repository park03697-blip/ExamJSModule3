//save task, get metrics, full of table and delete task


// BASE SETTINGS
//

const BASE_URL = "http://localhost:3001";
const activeSession = JSON.parse(localStorage.getItem("session"));

// ACCESS VALIDATION
if (!activeSession || activeSession.role !== "admin") {
  window.location.href = "../../public/views/login.html";
}

// Set admin name
document.getElementById("adminName").textContent = activeSession.name;

// DOM REFERENCES (correct IDs)
const totalTasksEl = document.getElementById("totalTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const completedTasksEl = document.getElementById("completedTasks");
const progressPercentEl = document.getElementById("progressPercent");
const adminTaskListEl = document.getElementById("adminTaskList");

// =====================================
// FETCH & RENDER ADMIN DASHBOARD
// =====================================

function renderAdminDashboard() {
  fetch(`${BASE_URL}/tasks`)
    .then((response) => response.json())
    .then((taskList) => {
      const total = taskList.length;
      const pending = taskList.filter((t) => t.status === "pending").length;
      const completed = taskList.filter((t) => t.status === "completed").length;

      // METRICS
      totalTasksEl.textContent = total;
      pendingTasksEl.textContent = pending;
      completedTasksEl.textContent = completed;

      // PROGRESS %
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      progressPercentEl.textContent = `${progress}%`;

      // TABLE RESET
      adminTaskListEl.innerHTML = "";

      if (total === 0) {
        adminTaskListEl.innerHTML =
          "<tr><td colspan='6'>No tasks available in the system</td></tr>";
        return;
      }

      // TABLE POPULATION
      taskList.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td><strong>${item.title}</strong></td>

          <td class="truncate" title="${item.description || "No details"}">
            ${item.description || '<span class="muted">No details</span>'}
          </td>

          <td>${item.userId}</td>

          <td>
            <span class="status-tag ${item.status}">
              ${item.status}
            </span>
          </td>

          <td>
            <span class="priority-tag ${item.priority || "medium"}">
              ${item.priority || "medium"}
            </span>
          </td>

          <td>
            <button 
              class="btn-remove" 
              onclick="removeTask('${item.id}')"
              title="Delete Task"
            >
              🗑️ Remove
            </button>
          </td>
        `;

        adminTaskListEl.appendChild(row);
      });
    })
    .catch((error) => console.error("Failed to load admin data:", error));
}

// =====================================
// DELETE TASK
// =====================================
function removeTask(taskId) {
  const confirmation = confirm(
    "Do you really want to delete this task? This action is permanent."
  );

  if (!confirmation) return;

  fetch(`${BASE_URL}/tasks/${taskId}`, { method: "DELETE" })
    .then((res) => {
      if (res.ok) {
        renderAdminDashboard();
      } else {
        alert("Unable to delete task.");
      }
    })
    .catch(() => alert("Server error while deleting task."));
}

// Make function accessible globally
window.removeTask = removeTask;

// =====================================
// INITIAL LOAD
// =====================================
renderAdminDashboard();
