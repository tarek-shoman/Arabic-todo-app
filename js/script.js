
function toArabicNumbers(num) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[digit]).join('');
}

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

    for (let i = 1; i <= lastDay.getDate(); i++) {
    
    const dayElement = document.createElement('div')
    dayElement.className = 'calendar-day';

    const dayNumber = document.createElement('div')
    dayNumber.className = 'day-number';
    dayNumber.textContent = toArabicNumbers(i);

    const dayName = document.createElement('div');
    dayName.className = 'day-name';
    const dayDate = new Date(currentYear, currentMonth, i);
    dayName.textContent = days[dayDate.getDay()].slice(0, 8);
    
    if (i === today.getDate() && today.getMonth() === currentMonth) {
        dayElement.classList.add('active')
    }

    dayElement.appendChild(dayNumber);
    dayElement.appendChild(dayName);
    calendar.appendChild(dayElement);
}}


function loadUserName() {
    let userName = localStorage.getItem('username')

    if (!userName) {
        userName = prompt('من فضلك أدخل اسمك:');
        if (userName) {
            localStorage.setItem('username' , userName)
        }
    }
    document.getElementById('userName').textContent = `مرحباً، ${userName}`;
}

function updateDate() {
    const today = new Date();
    document.querySelector('.day').textContent = days[today.getDay()];
    document.querySelector('.date').textContent = `${toArabicNumbers(today.getDate())}, ${months[today.getMonth()]} , ${toArabicNumbers(today.getFullYear())}`    
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || []
let displayedTasks = 5 ;

const priorityLabels = {
    'important-urgent': 'مهم وضروري',
    'important-not-urgent': 'مهم وغير ضروري',
    'not-important-urgent': 'عادي وضروري',
    'not-important-not-urgent': 'عادي غير ضروري'
}

function addTasks () {

    const taskInput = document.getElementById('taskInput');
    const taskStartTime = document.getElementById('taskStartTime');
    const taskEndTime = document.getElementById('taskEndTime');
    const taskPriority = document.getElementById('taskPriority');

if (taskInput.value.trim() === '' ) return;
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

function NotifiSound() {
    const audio = new Audio('sounds/notification.mp3');
    audio.play().catch(err => {
        console.log('Trying fallback sound...');
        const fallbackAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        fallbackAudio.play().catch(err => {
            console.log('Failed to play notification sound:', err);
        });
    });
}

function toggleTask(id) {
    const task = tasks.find(tooggle => tooggle.id === id)
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id)   
    if (taskIndex !== -1) {
        tasks[taskIndex].deleted =true
        saveTasks();
        renderTasks();
    }
}
function cleanupCompletedTasks() {
    const now = new Date().getTime();
    tasks = tasks.filter(task => {
        if (task.completed && task.completedAt) {
            const completedtime =  new Date(task.completedAt).getTime();
            return now - completedtime < 24 * 60 * 60 * 1000 // 24 hr 
        }
        return true;
    })
    saveTasks();
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const data = new Date(dateString);
    return `${data.toLocaleDateString('ar-EG')}${data.toLocaleTimeString('ar-EG')}`

}

function renderTasks() {
    cleanupCompletedTasks();
    const taskList = document.getElementById('taskList')
    taskList.innerHTML = '';


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

    if (activeTasks.length > displayedTasks ) {
        const  loadMoreBtn = document.createElement('button')
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.textContent = 'عرض المزيد';
        loadMoreBtn.addEventListener('click', () => {
            displayedTasks += 5 ;
            renderTasks();
        })
        taskList.appendChild(loadMoreBtn)
    }
    updateState();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    updateState();
}

function updateState() {
    const totalTask = tasks.filter(task => !task.deleted).length;
    const completedTasks = tasks.filter(task => task.completed && !task.deleted).length;
    const pendingTasks = totalTask - completedTasks;
    const allTimeCompleted = tasks.filter(task => task.completed && !task.deleted).length;

    document.getElementById('completedTasks').textContent = toArabicNumbers(completedTasks);
    document.getElementById('pendingTasks').textContent = toArabicNumbers(pendingTasks);
    document.getElementById('allTasksCompleted').textContent = toArabicNumbers(allTimeCompleted);
}

document.getElementById('addTaskBtn').addEventListener('click', addTasks);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTasks();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadUserName();
    createCalendar();
    updateDate();
    renderTasks();
    updateState();
});
