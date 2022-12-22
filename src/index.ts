import { v4 as uuidV4 } from 'uuid';

// This is what the Task will contain
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

// Rather than TS identifying the below variables as just 'element | null'
// We can use types such as <HTMLUListElement> to specify what kind of element it is
const list = document.querySelector<HTMLUListElement>('#list');
const input = document.querySelector<HTMLInputElement>('#new-task-title');
// When using 'getElementById', you cannot assign type, instead, use 'as <Type-here> | null'
const form = document.getElementById('new-task-form') as HTMLFormElement | null;

// Array of Task items (to push to Local storage and to access upon refresh)
const tasks: Task[] = loadTasks();
// For each available task, render the elements
tasks.forEach((task) => addListItem(task));

// The benefits of assigning types to elements is that TS will now know what certain of functions exist for them
// i.e. For inputs, '.value' exists whereas, for lists, '.value' doesn't

// -------------------------- Handle Form submission, including, generating Elements and saving data to local storage
form?.addEventListener('submit', (e) => {
  e.preventDefault();

  // 'input.value' returns error thus we need to add '?'
  // '?' This means 'If the value exists, return it, else, return null'
  if (input?.value == '' || input?.value == null) return;
  // Beyond the above if statement, TS knows that the value is in fact VALID

  const newTask: Task = {
    // const newTask = { < This is also valid
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  // Push task to the task array
  tasks.push(newTask);
  // Save current tasks to local storage
  saveTasks();
  // Generate the list item
  addListItem(newTask);
  // Clear input
  input.value = '';
});

// -------------------------- Generate the elements
function addListItem(task: Task) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');

  // Add an event listener to the checkbox
  checkbox.addEventListener('change', () => {
    // Update the task.completed property to equal to the current checkbox state
    task.completed = checkbox.checked;
    // Then save to local storage
    saveTasks();
  });
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
}

// -------------------------- Save data to local storage
function saveTasks() {
  localStorage.setItem('TASKS', JSON.stringify(tasks));
}

// -------------------------- Parse the Local storage data
// Task[] - We are explicitly returning an array of Tasks
function loadTasks(): Task[] {
  // Declare the local storage array
  const taskJson = localStorage.getItem('TASKS');
  // Check the data first before parsing
  if (taskJson == null) return [];
  // If above statement is false (meaning data is valid), return the data
  return JSON.parse(taskJson);
}
