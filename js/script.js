// يلا نخلي الأرقام عربي يا معلم
function toArabicNumbers(num) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[digit]).join('');
}

// نظبط الكالندر اهو
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

    // نحط الأيام كلها يا باشا
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
        
        // نعلم على النهاردة بقى
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
let displayedTasks = 5; // عدد المهام المعروضة في البداية

// Priority labels in Arabic
const priorityLabels = {
    'important-urgent': 'مهم وضروري',
    'important-not-urgent': 'مهم وغير ضروري',
    'not-important-urgent': 'عادي وضروري',
    'not-important-not-urgent': 'عادي غير ضروري'
};

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskStartTime = document.getElementById('taskStartTime');
    const taskEndTime = document.getElementById('taskEndTime');
    const taskPriority = document.getElementById('taskPriority');
    
    if (taskInput.value.trim() === '') return;
    
    const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false,
        startTime: taskStartTime.value,
        endTime: taskEndTime.value,
        priority: taskPriority.value,
        createdAt: new Date().toISOString(),
        completedAt: null,
        deleted: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    setupNotifications(task);
    
    taskInput.value = '';
    taskStartTime.value = '';
    taskEndTime.value = '';
}

// دالة تشغيل صوت التنبيه
function playNotificationSound() {
    const audio = new Audio('sounds/notification.mp3');
    
    // محاولة تشغيل الصوت مع صوت احتياطي
    audio.play().catch(error => {
        console.log('Trying fallback sound...');
        const fallbackAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        fallbackAudio.play().catch(err => {
            console.log('Failed to play notification sound:', err);
        });
    });
}

// دالة عرض الإشعار مع الصوت
function showNotification(message) {
    playNotificationSound();
    
    // إذا كان المتصفح يدعم الإشعارات
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification("تنبيه المهام", { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("تنبيه المهام", { body: message });
                }
            });
        }
    }
    
    // عرض التنبيه التقليدي كاحتياطي
    alert(message);
}

function setupNotifications(task) {
    if (task.startTime) {
        const startTime = new Date(task.startTime).getTime();
        const notifyTime = startTime - (5 * 60 * 1000); // 5 minutes before
        
        if (notifyTime > Date.now()) {
            setTimeout(() => {
                if (!task.completed && !task.deleted) {
                    showNotification(`المهمة "${task.text}" ستبدأ خلال 5 دقائق`);
                }
            }, notifyTime - Date.now());
        }
    }
    
    if (task.endTime) {
        const endTime = new Date(task.endTime).getTime();
        const notifyTime = endTime - (5 * 60 * 1000); // 5 minutes before
        
        if (notifyTime > Date.now()) {
            setTimeout(() => {
                if (!task.completed && !task.deleted) {
                    showNotification(`المهمة "${task.text}" ستنتهي خلال 5 دقائق`);
                }
            }, notifyTime - Date.now());
        }
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].deleted = true;
        saveTasks();
        renderTasks();
    }
}

function cleanupCompletedTasks() {
    const now = new Date().getTime();
    tasks = tasks.filter(task => {
        if (task.completed && task.completedAt) {
            const completedTime = new Date(task.completedAt).getTime();
            return now - completedTime < 24 * 60 * 60 * 1000; // 24 hours
        }
        return true;
    });
    saveTasks();
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('ar-EG')} ${date.toLocaleTimeString('ar-EG')}`;
}

function renderTasks() {
    cleanupCompletedTasks();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    // Filter active tasks (not deleted)
    const activeTasks = tasks.filter(task => !task.deleted);
    const visibleTasks = activeTasks.slice(0, displayedTasks);
    
    visibleTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.priority}`;
        if (task.completed) taskElement.classList.add('completed');
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        
        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';
        
        const priorityLabel = document.createElement('span');
        priorityLabel.className = 'priority-label';
        priorityLabel.textContent = priorityLabels[task.priority];
        
        const taskTimes = document.createElement('div');
        taskTimes.className = 'task-times';
        if (task.startTime) {
            taskTimes.innerHTML += `<span>البدء: ${formatDateTime(task.startTime)}</span>`;
        }
        if (task.endTime) {
            taskTimes.innerHTML += `<span>الانتهاء: ${formatDateTime(task.endTime)}</span>`;
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);
        taskMeta.appendChild(priorityLabel);
        taskMeta.appendChild(taskTimes);
        taskContent.appendChild(taskMeta);
        taskElement.appendChild(taskContent);
        taskElement.appendChild(deleteBtn);
        taskList.appendChild(taskElement);
    });
    
    // Add load more button if there are more tasks
    if (activeTasks.length > displayedTasks) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.textContent = 'عرض المزيد';
        loadMoreBtn.addEventListener('click', () => {
            displayedTasks += 5;
            renderTasks();
        });
        taskList.appendChild(loadMoreBtn);
    }
    
    updateStats();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStats();
}

function updateStats() {
    const totalTasks = tasks.filter(task => !task.deleted).length;
    const completedTasks = tasks.filter(task => task.completed && !task.deleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const allTimeCompleted = tasks.filter(task => task.completed && !task.deleted).length;

    document.getElementById('completedTasks').textContent = toArabicNumbers(completedTasks);
    document.getElementById('pendingTasks').textContent = toArabicNumbers(pendingTasks);
    document.getElementById('allTasksCompleted').textContent = toArabicNumbers(allTimeCompleted);
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
