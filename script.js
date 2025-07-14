document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  showClock();
});

function showClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById("clock").innerText = now.toLocaleString();
  }, 1000);
}

function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();

  if (taskText !== '') {
    const task = {
      text: taskText,
      completed: false,
      timestamp: null
    };
    saveTask(task);
    input.value = '';
    renderTasks();
  }
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const row = document.createElement('div');
    row.className = 'task-row';

    const leftSide = document.createElement('div');
    leftSide.style.display = 'flex';
    leftSide.style.alignItems = 'center';
    leftSide.style.gap = '10px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onclick = () => toggleComplete(index);

    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    if (task.completed) taskText.classList.add('completed');

    leftSide.appendChild(checkbox);
    leftSide.appendChild(taskText);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // ✅ Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTask(index);

    // ✅ Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(leftSide);
    row.appendChild(actions);
    li.appendChild(row);

    // ✅ Timestamp for completed tasks
    if (task.completed && task.timestamp) {
      const timestamp = document.createElement('div');
      timestamp.className = 'timestamp';
      timestamp.textContent = `Completed at: ${task.timestamp}`;
      li.appendChild(timestamp);
    }

    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].completed = !tasks[index].completed;
  tasks[index].timestamp = tasks[index].completed
    ? new Date().toLocaleString()
    : null;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function editTask(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim() || tasks[index].text; 
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
}
