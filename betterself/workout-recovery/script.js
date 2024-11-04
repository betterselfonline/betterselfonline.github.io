// Get references to HTML elements
const recoveryForm = document.getElementById('recovery-form');
const techniquesList = document.getElementById('techniques-list');
const restDayMessage = document.getElementById('rest-day-message');
const fitnessGoalsMessage = document.getElementById('fitness-goals-message');
const recoveryChart = document.getElementById('recovery-chart');

// Initialize IndexedDB
const db = indexedDB.open('recovery-tracker', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('recovery-logs', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('fitness-goals', { keyPath: 'id', autoIncrement: true });
};

// Initialize LocalStorage
const storage = window.localStorage;

// Define functions
function logRecovery(event) {
    event.preventDefault();
    const soreness = parseInt(document.getElementById('soreness').value);
    const fatigue = parseInt(document.getElementById('fatigue').value);
    const energy = parseInt(document.getElementById('energy').value);
    const log = { soreness, fatigue, energy, timestamp: Date.now() };
    db.transaction('recovery-logs', 'readwrite').objectStore('recovery-logs').add(log);
    updateTechniquesList();
    updateRestDayMessage();
    updateFitnessGoalsMessage();
}

function updateTechniquesList() {
    db.transaction('recovery-logs', 'readonly').objectStore('recovery-logs').getAll().onsuccess = (event) => {
        const logs = event.target.result;
        const techniques = [];
        logs.forEach((log) => {
            if (log.soreness > 3) techniques.push('Stretching');
            if (log.fatigue > 3) techniques.push('Foam Rolling');
            if (log.energy < 3) techniques.push('Hydration');
        });
        techniquesList.innerHTML = '';
        techniques.forEach((technique) => {
            const li = document.createElement('li');
            li.textContent = technique;
            techniquesList.appendChild(li);
        });
    };
}

function updateRestDayMessage() {
    db.transaction('recovery-logs', 'readonly').objectStore('recovery-logs').getAll().onsuccess = (event) => {
        const logs = event.target.result;
        const recentLogs = logs.slice(-3);
        const restDayRecommended = recentLogs.every((log) => log.soreness > 3 || log.fatigue > 3);
        restDayMessage.textContent = restDayRecommended ? 'Take a rest day!' : 'You\'re good to go!';
    };
}

function updateFitnessGoalsMessage() {
    db.transaction('fitness-goals', 'readonly').objectStore('fitness-goals').getAll().onsuccess = (event) => {
        const goals = event.target.result;
        const goal = goals[0];
        if (goal) {
            const progress = db.transaction('recovery-logs', 'readonly').objectStore('recovery-logs').getAll().onsuccess = (event) => {
                const logs = event.target.result;
                const progressLogs = logs.filter((log) => log.timestamp > goal.startDate);
                const averageSoreness = progressLogs.reduce((sum, log) => sum + log.soreness, 0) / progressLogs.length;
                const averageFatigue = progressLogs.reduce((sum, log) => sum + log.fatigue, 0) / progressLogs.length;
                const averageEnergy = progressLogs.reduce((sum, log) => sum + log.energy, 0) / progressLogs.length;
                fitnessGoalsMessage.textContent = `You're making progress Your average soreness is ${averageSoreness}, fatigue is ${averageFatigue}, and energy is ${averageEnergy}.`;
            };
        }
    };
}

function updateRecoveryChart() {
    db.transaction('recovery-logs', 'readonly').objectStore('recovery-logs').getAll().onsuccess = (event) => {
        const logs = event.target.result;
        const chartData = logs.map((log) => ({ x: log.timestamp, y: log.soreness }));
        const chart = new Chart(recoveryChart, {
            type: 'line',
            data: {
                labels: chartData.map((data) => new Date(data.x).toLocaleDateString()),
                datasets: [{
                    label: 'Soreness',
                    data: chartData.map((data) => data.y),
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
}

// Add event listeners
recoveryForm.addEventListener('submit', logRecovery);

// Initialize app
updateTechniquesList();
updateRestDayMessage();
updateFitnessGoalsMessage();
updateRecoveryChart();
