// ---------- Состояние ----------
// Задачи хранятся в массиве объектов: { id, text, completed }
let todos = [];
let nextId = 1;                 // счётчик для уникальных id
let currentFilter = 'all';      // 'all' | 'active' | 'completed'

// ---------- Элементы DOM ----------
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const warning = document.getElementById('warning');
const list = document.getElementById('todo-list');
const stats = document.getElementById('stats');
const filters = document.getElementById('filters');

// ---------- Действия над данными ----------
function addTodo(text) {
  todos.push({ id: nextId++, text: text, completed: false });
}

function toggleTodo(id) {
  todos = todos.map(function (todo) {
    return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
  });
}

function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
}

// Какие задачи показывать при текущем фильтре (данные не меняются)
function getVisibleTodos() {
  return todos.filter(function (todo) {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });
}

// ---------- Отрисовка ----------
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (todo.completed ? ' completed' : '');
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = todo.text;      // textContent защищает от вставки HTML

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'delete-btn';
  del.textContent = 'Удалить';

  li.append(checkbox, span, del);
  return li;
}

function renderStats() {
  const done = todos.filter(function (t) { return t.completed; }).length;
  const left = todos.length - done;
  stats.textContent = 'Осталось: ' + left + ', Выполнено: ' + done;
}

function renderFilters() {
  filters.querySelectorAll('.filter').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}

function render() {
  list.innerHTML = '';
  const visible = getVisibleTodos();

  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Задач нет';
    list.append(empty);
  } else {
    visible.map(createTodoElement).forEach(function (el) {
      list.append(el);
    });
  }

  renderStats();
  renderFilters();
}

// ---------- События ----------
// submit срабатывает и по кнопке «Добавить», и по Enter
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = input.value.trim();

  if (text === '') {
    warning.hidden = false;
    return;
  }

  warning.hidden = true;
  addTodo(text);
  input.value = '';
  render();
});

// Делегирование: один обработчик на весь список
list.addEventListener('click', function (event) {
  const item = event.target.closest('.todo-item');
  if (!item) return;
  const id = Number(item.dataset.id);

  if (event.target.classList.contains('delete-btn')) {
    deleteTodo(id);
    render();
  } else if (event.target.type === 'checkbox') {
    toggleTodo(id);
    render();
  }
});

filters.addEventListener('click', function (event) {
  const btn = event.target.closest('.filter');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  render();
});

input.addEventListener('input', function () {
  warning.hidden = true;
});

render();