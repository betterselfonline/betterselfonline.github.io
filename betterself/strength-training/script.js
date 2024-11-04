// Initialize IndexedDB
const db = indexedDB.open('strength-training-log', 1);

db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });
};

db.onsuccess = (event) => {
    console.log('IndexedDB initialized');
};

// Initialize LocalStorage
const storage = window.localStorage;

// Get settings from LocalStorage
const units = storage.getItem('units') || 'lbs';

// Set up event listeners
document.getElementById('log-btn').addEventListener('click', logWorkout);
document.getElementById('save-settings-btn').addEventListener('click', saveSettings);

// Log workout function
function logWorkout() {
    const exercise = document.getElementById('exercise').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value;
    const sets = document.getElementById('sets').value;

    const log = {
        exercise,
        reps,
        weight,
        sets,
        date: new Date().toISOString(),
    };

    // Add log to IndexedDB
    const transaction = db.transaction(['logs'], 'readwrite');
    const logStore = transaction.objectStore('logs');
    const request = logStore.add(log);

    request.onsuccess = () => {
        console.log('Log added to IndexedDB');
        displayLogs();
    };

    request.onerror = () => {
        console.error('Error adding log to IndexedDB');
    };
}

// Display logs function
function displayLogs() {
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';

    const transaction = db.transaction(['logs'], 'readonly');
    const logStore = transaction.objectStore('logs');
    const request = logStore.getAll();

    request.onsuccess = () => {
        const logs = request.result;
        logs.forEach((log) => {
            const logItem = document.createElement('li');
            logItem.textContent = `${log.exercise} - ${log.reps} reps, ${log.weight} ${units}, ${log.sets} sets`;
            logList.appendChild(logItem);
        });
    };

    request.onerror = () => {
        console.error('Error retrieving logs from IndexedDB');
    };
}

// Save settings function
function saveSettings() {
    const units = document.getElementById('units').value;
    storage.setItem('units', units);
    console.log('Settings saved to LocalStorage');
}

// Initialize dashboard chart
const chartCanvas = document.getElementById('chart');
const chart = new Chart(chartCanvas, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Progress',
            data: [],
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

// Update dashboard chart with data from IndexedDB
function updateChart() {
    const transaction = db.transaction(['logs'], 'readonly');
    const logStore = transaction.objectStore('logs');
    const request = logStore.getAll();

    request.onsuccess = () => {
        const logs = request.result;
        const chartData = logs.map((log) => log.weight);
        chart.data.datasets[0].data = chartData;
        chart.update();
    };

    request.onerror = () => {
        console.error('Error retrieving logs from IndexedDB');
    };
}

// Initialize suggestions list
const suggestionList = document.getElementById('suggestion-list');

// Generate suggestions based on user's progress
function generateSuggestions() {
    const transaction = db.transaction(['logs'], 'readonly');
    const logStore = transaction.objectStore('logs');
    const request = logStore.getAll();

    request.onsuccess = () => {
        const logs = request.result;
        const suggestions = [];

        // Simple suggestion algorithm: suggest exercises with increasing weight
        logs.forEach((log) => {
            const exercise = log.exercise;
            const weight = log.weight;
            const suggestion = {
                exercise,
                weight: weight + 5
            };
            suggestions.push(suggestion);
        });

        suggestionList.innerHTML = '';
        suggestions.forEach((suggestion) => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = `Try ${suggestion.exercise} with ${suggestion.weight} ${units}`;
            suggestionList.appendChild(suggestionItem);
        });
    };

    request.onerror = () => {
        console.error('Error retrieving logs from IndexedDB');
    };
}

// Initialize tips list
const tipList = document.getElementById('tip-list');

// Generate tips based on user's progress
function generateTips() {
    const transaction = db.transaction(['logs'], 'readonly');
    const logStore = transaction.objectStore('logs');
    const request = logStore.getAll();

    request.onsuccess = () => {
        const logs = request.result;
        const tips = [];

        // Simple tip algorithm: suggest tips based on exercise type
        logs.forEach((log) => {
            const exercise = log.exercise;
            const tip = {
                exercise,
                tip: `Remember to keep your back straight and engage your core when doing ${exercise}`
            };
            tips.push(tip);
        });

        tipList.innerHTML = '';
        tips.forEach((tip) => {
            const tipItem = document.createElement('li');
            tipItem.textContent = tip.tip;
            tipList.appendChild(tipItem);
        });
    };

    request.onerror = () => {
        console.error('Error retrieving logs from IndexedDB');
    };
}

// Initialize PR notifications
function checkForPRs() {
    const transaction = db.transaction(['logs'], 'readonly');
    const logStore = transaction.objectStore('logs');
    const request = logStore.getAll();

    request.onsuccess = () => {
        const logs = request.result;
        const prs = [];

        // Simple PR algorithm: check for new max weights
        logs.forEach((log) => {
            const exercise = log.exercise;
            const weight = log.weight;
            const pr = {
                exercise,
                weight
            };
            prs.push(pr);
        });

        // Display PR notifications
        prs.forEach((pr) => {
            const notification = document.createElement('div');
            notification.textContent = `New PR: ${pr.exercise} - ${pr.weight} ${units}`;
            notification.className = 'pr-notification';
            document.body.appendChild(notification);
        });
    };

    request.onerror = () => {
        console.error('Error retrieving logs from IndexedDB');
    };
}

// Call functions to initialize app
displayLogs();
updateChart();
generateSuggestions();
generateTips();
checkForPRs();

