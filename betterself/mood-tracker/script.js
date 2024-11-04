// Get references to HTML elements
const moodForm = document.getElementById('mood-form');
const moodSelect = document.getElementById('mood');
const submitMoodButton = document.getElementById('submit-mood');
const moodLog = document.getElementById('mood-log');
const patternGraph = document.getElementById('pattern-graph');
const triggerForm = document.getElementById('trigger-form');
const triggerInput = document.getElementById('trigger');
const submitTriggerButton = document.getElementById('submit-trigger');
const triggerLog = document.getElementById('trigger-log');
const resourceList = document.getElementById('resource-list');
const insightGraph = document.getElementById('insight-graph');

// Initialize IndexedDB
const db = indexedDB.open('mood-tracker', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('moods', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('triggers', { keyPath: 'id', autoIncrement: true });
};

// Initialize LocalStorage
const storage = window.localStorage;

// Function to log mood
function logMood(mood) {
    const transaction = db.transaction(['moods'], 'readwrite');
    const store = transaction.objectStore('moods');
    const request = store.add({ mood, date: new Date().toISOString() });
    request.onsuccess = () => {
        console.log('Mood logged successfully');
    };
    request.onerror = (event) => {
        console.error('Error logging mood:', event.target.error);
    };
}

// Function to log trigger
function logTrigger(trigger) {
    const transaction = db.transaction(['triggers'], 'readwrite');
    const store = transaction.objectStore('triggers');
    const request = store.add({ trigger, date: new Date().toISOString() });
    request.onsuccess = () => {
        console.log('Trigger logged successfully');
    };
    request.onerror = (event) => {
        console.error('Error logging trigger:', event.target.error);
    };
}

// Function to display mood log
function displayMoodLog() {
    const transaction = db.transaction(['moods'], 'readonly');
    const store = transaction.objectStore('moods');
    const request = store.getAll();
    request.onsuccess = (event) => {
        const moods = event.target.result;
        const logHtml = moods.map((mood) => {
            return `<p>${mood.mood} on ${mood.date}</p>`;
        }).join('');
        moodLog.innerHTML = logHtml;
    };
    request.onerror = (event) => {
        console.error('Error displaying mood log:', event.target.error);
    };
}

// Function to display trigger log
function displayTriggerLog() {
    const transaction = db.transaction(['triggers'], 'readonly');
    const store = transaction.objectStore('triggers');
    const request = store.getAll();
    request.onsuccess = (event) => {
        const triggers = event.target.result;
        const logHtml = triggers.map((trigger) => {
            return `<p>${trigger.trigger} on ${trigger.date}</p>`;
        }).join('');
        triggerLog.innerHTML = logHtml;
    };
    request.onerror = (event) => {
        console.error('Error displaying trigger log:', event.target.error);
    };
}

// Function to display pattern graph
function displayPatternGraph() {
    const transaction = db.transaction(['moods'], 'readonly');
    const store = transaction.objectStore('moods');
    const request = store.getAll();
    request.onsuccess = (event) => {
        const moods = event.target.result;
        const graphData = moods.map((mood) => {
            return { date: mood.date, mood: mood.mood };
        });
        const graph = new Chart(patternGraph, {
            type: 'line',
            data: {
                labels: graphData.map((data) => data.date),
                datasets: [{
                    label: 'Mood',
                    data: graphData.map((data) => data.mood),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    };
    request.onerror = (event) => {
        console.error('Error displaying pattern graph:', event.target.error);
    };
}

// Function to display insight graph
function displayInsightGraph() {
    const transaction = db.transaction(['moods'], 'readonly');
    const store = transaction.objectStore('moods');
    const request = store.getAll();
    request.onsuccess = (event) => {
        const moods = event.target.result;
        const graphData = moods.map((mood) => {
            return { date: mood.date, mood: mood.mood };
        });
        const graph = new Chart(insightGraph, {
            type: 'bar',
            data: {
                labels: graphData.map((data) => data.date),
                datasets: [{
                    label: 'Mood',
                    data: graphData.map((data) => data.mood),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    };
    request.onerror = (event) => {
        console.error('Error displaying insight graph:', event.target.error);
    };
}

// Event listeners
submitMoodButton.addEventListener('click', (event) => {
    event.preventDefault();
    const mood = moodSelect.value;
    logMood(mood);
    displayMoodLog();
});

submitTriggerButton.addEventListener('click', (event) => {
    event.preventDefault();
    const trigger = triggerInput.value;
    logTrigger(trigger);
    displayTriggerLog();
});

// Initialize app
displayMoodLog();
displayTriggerLog();
displayPatternGraph();
displayInsightGraph();
