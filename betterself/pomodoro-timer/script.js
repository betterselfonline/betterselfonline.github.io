// Get elements
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const settingsForm = document.getElementById('settings-form');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const stretchReminderInput = document.getElementById('stretch-reminder');
const analyticsContainer = document.getElementById('analytics-container');
const totalFocusedTimeDisplay = document.getElementById('total-focused-time');
const totalBreakTimeDisplay = document.getElementById('total-break-time');
const focusStreakDisplay = document.getElementById('focus-streak');
const stretchGuideContainer = document.getElementById('stretch-guide-container');
const groupFocusContainer = document.getElementById('group-focus-container');

// Initialize variables
let workTime = 25;
let breakTime = 5;
let stretchReminder = false;
let focusedTime = 0;
let focusStreak = 0;
let timerInterval;

// Load settings from LocalStorage
if (localStorage.getItem('workTime')) {
    workTime = parseInt(localStorage.getItem('workTime'));
    workTimeInput.value = workTime;
}

if (localStorage.getItem('breakTime')) {
    breakTime = parseInt(localStorage.getItem('breakTime'));
    breakTimeInput.value = breakTime;
}

if (localStorage.getItem('stretchReminder')) {
    stretchReminder = localStorage.getItem('stretchReminder') === 'true';
    stretchReminderInput.checked = stretchReminder;
}

// Save settings to LocalStorage
settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    workTime = parseInt(workTimeInput.value);
    breakTime = parseInt(breakTimeInput.value);
    stretchReminder = stretchReminderInput.checked;
    localStorage.setItem('workTime', workTime);
    localStorage.setItem('breakTime', breakTime);
    localStorage.setItem('stretchReminder', stretchReminder);
});

// Start timer
startButton.addEventListener('click', () => {
    timerInterval = setInterval(() => {
        focusedTime++;
        totalFocusedTimeDisplay.textContent = `Total Focused Time: ${focusedTime} minutes`;
        if (focusedTime >= workTime) {
            clearInterval(timerInterval);
            timerDisplay.textContent = `Break Time: ${breakTime} minutes`;
            setTimeout(() => {
                focusedTime = 0;
                timerDisplay.textContent = `Work Time: ${workTime} minutes`;
                timerInterval = setInterval(() => {
                    focusedTime++;
                    totalFocusedTimeDisplay.textContent = `Total Focused Time: ${focusedTime} minutes`;
                }, 60000);
            }, breakTime * 60000);
        }
    }, 60000);
});

// Reset timer
resetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    focusedTime = 0;
    totalFocusedTimeDisplay.textContent = `Total Focused Time: 0 minutes`;
    timerDisplay.textContent = `Work Time: ${workTime} minutes`;
});

// Stretch reminder
if (stretchReminder) {
    setInterval(() => {
        if (focusedTime >= workTime) {
            alert('Time to stretch!');
        }
    }, 60000);
}

// Analytics
setInterval(() => {
    totalBreakTimeDisplay.textContent = `Total Break Time: ${breakTime} minutes`;
    focusStreakDisplay.textContent = `Focus Streak: ${focusStreak} sessions`;
}, 60000);

// Stretch guide
stretchGuideContainer.addEventListener('click', () => {
    const stretchGuide = document.createElement('div');
    stretchGuide.innerHTML = `
        <h3>Neck Stretch</h3>
        <p>Slowly tilt your head to the side, bringing your ear towards your shoulder.</p>
        <h3>Shoulder Rolls</h3>
        <p>Roll your shoulders forward and backward in a circular motion.</p>
    `;
    stretchGuideContainer.appendChild(stretchGuide);
});

// Group focus
groupFocusContainer.addEventListener('click', () => {
    const groupFocus = document.createElement('div');
    groupFocus.innerHTML = `
        <h3>Join a Group Focus Session</h3>
        <p>Enter the group code to join a session:</p>
        <input type="text" id="group-code">
        <button id="join-group-button">Join</button>
    `;
    groupFocusContainer.appendChild(groupFocus);
});

// IndexedDB
const db = indexedDB.open('pomodoroDB', 1);
db.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('focusSessions', { keyPath: 'id', autoIncrement: true });
};

db.onsuccess = (e) => {
    const db = e.target.result;
    const focusSessionsStore = db.transaction('focusSessions', 'readwrite').objectStore('focusSessions');
    focusSessionsStore.getAll().onsuccess = (e) => {
        const focusSessions = e.target.result;
        console.log(focusSessions);
    };
};
