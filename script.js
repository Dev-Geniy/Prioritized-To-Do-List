// Переключение темы
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const icon = toggleButton.querySelector('.icon');

// Загрузка сохраненной темы
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
icon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

// Обработчик переключения
toggleButton.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    icon.textContent = newTheme === 'light' ? '☀️' : '🌙';
});

// Логика списка дел
const addButton = document.getElementById('add-task');
const taskInput = document.getElementById('task-input');
const priorityButton = document.getElementById('priority-btn');
const priorityMenu = document.getElementById('priority-menu');
const taskList = document.getElementById('tasks');

// Загрузка задач из localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

// Показать/скрыть меню приоритетов
priorityButton.addEventListener('click', () => {
    priorityMenu.style.display = priorityMenu.style.display === 'block' ? 'none' : 'block';
});

// Выбор приоритета
priorityMenu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
        const priority = item.getAttribute('data-value');
        priorityButton.textContent = priority.charAt(0).toUpperCase();
        priorityButton.dataset.priority = priority;
        priorityMenu.style.display = 'none';
    });
});

// Закрытие меню при клике вне его
document.addEventListener('click', (e) => {
    if (!priorityButton.contains(e.target) && !priorityMenu.contains(e.target)) {
        priorityMenu.style.display = 'none';
    }
});

addButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        priority: priorityButton.dataset.priority,
        completed: false
    };

    tasks.push(task);
    saveAndRender();
    taskInput.value = ''; // Очистка поля
});

function renderTasks() {
    // Сортировка: высокий → средний → низкий
    tasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.priority}${task.completed ? ' completed' : ''}`;
        li.innerHTML = `
            <label class="switch">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
            <span>${task.text}</span>
            <button>Delete</button>
        `;

        // Отметка выполнения
        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveAndRender();
        });

        // Удаление задачи
        const deleteButton = li.querySelector('button');
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        });

        taskList.appendChild(li);
    });
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Копирование Bitcoin-адреса
const copyBtcButton = document.querySelector('.btc-address .copy-btn');
copyBtcButton.addEventListener('click', () => {
    const btcCode = document.getElementById('btc-code').textContent;
    navigator.clipboard.writeText(btcCode).then(() => {
        copyBtcButton.textContent = 'Copied!';
        setTimeout(() => {
            copyBtcButton.textContent = 'Copy';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});
