let taskList = document.getElementById("taskList");
let taskInput = document.getElementById("taskInput");

window.onload = loadTasks;

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;
  addTaskToDOM(text);
  saveTasks();
  taskInput.value = "";
}

function addTaskToDOM(text, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  li.innerHTML = `
    <span onclick="toggleComplete(this)">${text}</span>
    <button onclick="deleteTask(this)">Delete</button>
  `;
  taskList.appendChild(li);
}

function toggleComplete(element) {
  element.parentElement.classList.toggle("completed");
  saveTasks();
}

function deleteTask(button) {
  button.parentElement.remove();
  saveTasks();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.innerText.replace("Delete", "").trim(),
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
