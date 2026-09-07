const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");
const filter = document.getElementById("filter");

let tasks = JSON.parse(
  localStorage.getItem("studyTasks") || "[]"
);


// Display today's date

document.getElementById("today").textContent =
  new Date().toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );


// Add new task

form.addEventListener("submit", function(event) {

  event.preventDefault();

  const newTask = {

    id: Date.now(),

    subject: document
      .getElementById("subject")
      .value
      .trim(),

    task: document
      .getElementById("task")
      .value
      .trim(),

    date: document
      .getElementById("date")
      .value,

    priority: document
      .getElementById("priority")
      .value,

    completed: false

  };

  tasks.push(newTask);

  saveTasks();

  form.reset();

});


// Filter tasks

filter.addEventListener(
  "change",
  renderTasks
);


// Save tasks

function saveTasks() {

  localStorage.setItem(
    "studyTasks",
    JSON.stringify(tasks)
  );

  renderTasks();

}


// Complete / undo task

function toggleTask(id) {

  tasks = tasks.map(function(task) {

    if (task.id === id) {

      return {
        ...task,
        completed: !task.completed
      };

    }

    return task;

  });

  saveTasks();

}


// Delete task

function deleteTask(id) {

  tasks = tasks.filter(function(task) {

    return task.id !== id;

  });

  saveTasks();

}


// Display tasks

function renderTasks() {

  const mode = filter.value;

  const visibleTasks = tasks.filter(function(task) {

    if (mode === "completed") {
      return task.completed;
    }

    if (mode === "pending") {
      return !task.completed;
    }

    return true;

  });


  if (visibleTasks.length === 0) {

    list.innerHTML =
      '<div class="empty">No tasks yet. Add your first study task!</div>';

  } else {

    list.innerHTML = visibleTasks
      .map(function(task) {

        return `

          <div class="task ${task.completed ? "done" : ""}">

            <div>

              <div class="task-title">
                ${escapeHTML(task.subject)}
                —
                ${escapeHTML(task.task)}
              </div>

              <div class="task-meta">
                Due: ${task.date || "No date"}
              </div>

              <span class="badge ${task.priority.toLowerCase()}">
                ${task.priority}
              </span>

            </div>


            <div class="actions">

              <button onclick="toggleTask(${task.id})">
                ${task.completed ? "Undo" : "Done"}
              </button>

              <button
                class="delete"
                onclick="deleteTask(${task.id})"
              >
                Delete
              </button>

            </div>

          </div>

        `;

      })
      .join("");

  }


  updateStats();

}


// Update dashboard statistics

function updateStats() {

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const total = tasks.length;

  document.getElementById(
    "totalTasks"
  ).textContent = total;

  document.getElementById(
    "completedTasks"
  ).textContent = completed;

  document.getElementById(
    "pendingTasks"
  ).textContent = total - completed;

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  document.getElementById(
    "progress"
  ).textContent = percentage + "%";

}


// Prevent HTML injection

function escapeHTML(text) {

  return text.replace(
    /[&<>"']/g,
    function(character) {

      const entities = {

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      };

      return entities[character];

    }
  );

}


// Initial display

renderTasks();
