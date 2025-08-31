const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskCategory = document.getElementById("task-category");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  tasks
    .filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .forEach((task, index) => {
      const taskCard = document.createElement("div");
      taskCard.className = `task-card ${task.completed ? "completed" : ""}`;

      taskCard.innerHTML = `
        <div class="task-info">
          <p>${task.text} <span class="category">${task.category}</span></p>
          <span>${task.date || "No deadline"}</span>
        </div>
        <div class="actions">
          <button class="done-btn" onclick="toggleComplete(${index})">Done</button>
          <button class="edit-btn" onclick="editTask(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteTask(${index})">Remove</button>
        </div>
      `;

      taskList.appendChild(taskCard);
    });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value ? new Date(taskDate.value).toLocaleString() : "";
  const category = taskCategory.value;

  if (!text) return alert("Please enter a task!");

  tasks.push({ text, date, category, completed: false });
  taskInput.value = "";
  taskDate.value = "";
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText) tasks[index].text = newText;
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
}

addTaskBtn.addEventListener("click", addTask);

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

renderTasks();
