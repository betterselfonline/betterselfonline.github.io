// Initialize IndexedDB
const db = indexedDB.open('productivity-journal', 1);

db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('time-spent', { keyPath: 'id', autoIncrement: true });
};

db.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
};

// Initialize LocalStorage
const storage = window.localStorage;

// Get today's date
const today = new Date();
const date = today.toISOString().split('T')[0];

// Entry form submission handler
document.getElementById('submit-entry').addEventListener('click', (event) => {
    event.preventDefault();
    const accomplishments = document.getElementById('accomplishments').value;
    const goals = document.getElementById('goals').value;
    const reflections = document.getElementById('reflections').value;
    const entry = { date, accomplishments, goals, reflections };
    db.transaction('entries', 'readwrite').objectStore('entries').add(entry);
    storage.setItem('last-entry-date', date);
    document.getElementById('entry-form').reset();
});

// Productivity score input handler
document.getElementById('productivity-score-input').addEventListener('input', (event) => {
    const score = event.target.value;
    document.getElementById('productivity-score-display').textContent = `${score}/10`;
    storage.setItem('productivity-score', score);
});

// Time spent tracking form submission handler
document.getElementById('log-time-spent').addEventListener('click', (event) => {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const timeSpent = document.getElementById('time-spent').value;
    const entry = { date, taskName, timeSpent };
    db.transaction('time-spent', 'readwrite').objectStore('time-spent').add(entry);
    document.getElementById('time-spent-tracking').reset();
});

// Insights button click handler
document.getElementById('view-insights').addEventListener('click', () => {
    // TO DO: implement insights display
});

// Focus zone recommendations button click handler
document.getElementById('view-recommendations').addEventListener('click', () => {
    // TO DO: implement focus zone recommendations display
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const lastEntryDate = storage.getItem('last-entry-date');
    if (lastEntryDate === date) {
        document.getElementById('entry-form').reset();
    }
});
