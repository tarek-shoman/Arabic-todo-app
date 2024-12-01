// يلا نخلي الأرقام عربي يا معلم
function toArabicNumbers(num) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[digit]).join('');
}

// نظبط الكالندر 
const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

function createCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // نحط الأيام كلها  
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = toArabicNumbers(i);
        
        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        const dayDate = new Date(currentYear, currentMonth, i);
        dayName.textContent = days[dayDate.getDay()].slice(0, 8);
        
        if (i === today.getDate() && today.getMonth() === currentMonth) {
            dayElement.classList.add('active');
        }
        
        dayElement.appendChild(dayNumber);
        dayElement.appendChild(dayName);
        calendar.appendChild(dayElement);
    }
}

// نحط الاستايل بتاع الكالندر يا معلم
const calendarStyle = document.createElement('style');
calendarStyle.textContent = `
    .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
        margin-bottom: 10px;
        font-weight: bold;
        text-align: center;
        padding: 10px 0;
        background: #f8f9fa;
        border-radius: 8px;
        font-size: 14px;
        color: #666;
    }
    
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .calendar-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 4px;
        border-radius: 8px;
        font-family: 'Cairo', sans-serif;
    }
    
    .day-number {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 2px;
    }
    
    .day-name {
        font-size: 12px;
        color: #666;
    }
    
    .calendar-day.empty {
        background: none;
    }
    
    .calendar-day:hover , .day-name:hover{
        color: #ff6b6b;
        cursor: pointer;
    }
    .calendar-day.active {
        background-color: #ff6b6b;
        color: white;
    }
    
    .calendar-day.active .day-name {
        color: rgba(255, 255, 255, 0.8);
    }
`;
document.head.appendChild(calendarStyle);

// هات اسم اليوزر يا كبير
function loadUserName() {
    let userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt('من فضلك أدخل اسمك:');
        if (userName) {
            localStorage.setItem('userName', userName);
        }
    }
    document.getElementById('userName').textContent = `مرحباً، ${userName}`;
}

// نظبط التاريخ اهو
function updateDate() {
    const today = new Date();
    document.querySelector('.day').textContent = days[today.getDay()];
    document.querySelector('.date').textContent = `${toArabicNumbers(today.getDate())}, ${months[today.getMonth()]} ${toArabicNumbers(today.getFullYear())}`;
}

// شغل التاسكات يا برنس
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            date: new Date().toISOString()
        };
        
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStats();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.textContent = task.text;
        if (task.completed) {
            taskContent.style.textDecoration = 'line-through';
        }
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = task.completed ? 'تراجع' : 'تم';
        toggleBtn.onclick = () => toggleTask(task.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'حذف';
        deleteBtn.onclick = () => deleteTask(task.id);
        
        taskActions.appendChild(toggleBtn);
        taskActions.appendChild(deleteBtn);
        
        taskElement.appendChild(taskContent);
        taskElement.appendChild(taskActions);
        
        taskList.appendChild(taskElement);
    });
}

function updateStats() {
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;
    
    document.getElementById('completedTasks').textContent = toArabicNumbers(completedTasks);
    document.getElementById('pendingTasks').textContent = toArabicNumbers(pendingTasks);
    document.getElementById('allTasksCompleted').textContent = toArabicNumbers(completedTasks);
}

// خلي بالك من الإيفنتات دي يا معلم
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserName();
    createCalendar();
    updateDate();
    renderTasks();
    updateStats();
});
