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
  const taskInput = document.getElementById('taskInput');
  const deadlineInput = document.getElementById('deadlineInput');
  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (taskText !== '') {
    const task = {
      text: taskText,
      completed: false,
      timestamp: null,
      deadline: deadline || null
    };
    saveTask(task);
    taskInput.value = '';
    deadlineInput.value = '';
    renderTasks();
  }
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
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

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(leftSide);
    row.appendChild(actions);
    li.appendChild(row);

    // ✅ Show deadline
    if (task.deadline) {
      const deadline = document.createElement('div');
      deadline.className = 'deadline';
      deadline.textContent = `🗓️ Deadline: ${task.deadline}`;
      li.appendChild(deadline);
    }

    // ✅ Show timestamp if completed
    if (task.completed && task.timestamp) {
      const timestamp = document.createElement('div');
      timestamp.className = 'timestamp';
      timestamp.textContent = `✅ Completed: ${task.timestamp}`;
      li.appendChild(timestamp);
    }

    taskList.appendChild(li);
  });
}


function loadTasks() {
  renderTasks();
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
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskList = document.getElementById('taskList');

  const taskItem = taskList.children[index];
  const row = taskItem.querySelector('.task-row');
  const actions = row.querySelector('.task-actions');
  const left = row.querySelector('div');

  const task = tasks[index];

  // Clear existing row content
  left.innerHTML = '';
  actions.innerHTML = '';

  // Create editable input for task text
  const input = document.createElement('input');
  input.type = 'text';
  input.value = task.text;
  input.style.flex = '1';
  input.style.padding = '5px';
  input.style.borderRadius = '6px';

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.disabled = true;

  // Deadline input
  const deadlineInput = document.createElement('input');
  deadlineInput.type = 'date';
  deadlineInput.value = task.deadline || '';
  deadlineInput.style.marginLeft = '10px';

  left.appendChild(checkbox);
  left.appendChild(input);
  left.appendChild(deadlineInput);

  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.onclick = () => {
    const newText = input.value.trim();
    const newDeadline = deadlineInput.value;
    if (newText) {
      tasks[index].text = newText;
      tasks[index].deadline = newDeadline || null;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  };

  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = renderTasks;

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
}
