// Get references to HTML elements
const settingsForm = document.getElementById('settings-form');
const weightInput = document.getElementById('weight');
const activityLevelSelect = document.getElementById('activity-level');
const climateSelect = document.getElementById('climate');
const saveSettingsButton = document.getElementById('save-settings');
const reminderList = document.getElementById('reminder-list');
const addReminderButton = document.getElementById('add-reminder');
const logList = document.getElementById('log-list');

// Initialize LocalStorage and IndexedDB
const localStorage = window.localStorage;
const indexedDB = window.indexedDB;

// Define constants
const WATER_GOAL_MULTIPLIER = 0.033; // 33 mL/kg body weight
const ACTIVITY_LEVEL_MULTIPLIER = {
    'sedentary': 1,
    'lightly-active': 1.2,
    'moderately-active': 1.5,
    'very-active': 1.8,
    'extra-active': 2.0
};
const CLIMATE_MULTIPLIER = {
    'temperate': 1,
    'hot': 1.2,
    'dry': 1.5
};

// Define functions
function calculateWaterGoal(weight, activityLevel, climate) {
    const waterGoal = weight * WATER_GOAL_MULTIPLIER * ACTIVITY_LEVEL_MULTIPLIER[activityLevel] * CLIMATE_MULTIPLIER[climate];
    return Math.round(waterGoal);
}

function saveSettings() {
    const weight = weightInput.value;
    const activityLevel = activityLevelSelect.value;
    const climate = climateSelect.value;
    const waterGoal = calculateWaterGoal(weight, activityLevel, climate);
    const db = indexedDB.open('hydration-reminder', 1);
    db.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('settings', { keyPath: 'id' });
    };
    db.onsuccess = (event) => {
        const db = event.target.result;
        const settingsStore = db.transaction('settings', 'readwrite').objectStore('settings');
        const request = settingsStore.get('settings');
        request.onsuccess = (event) => {
            const settings = event.target.result;
            if (settings) {
                const updateRequest = settingsStore.put({
                    id: 'settings',
                    waterGoal: waterGoal,
                    activityLevel: activityLevel,
                    climate: climate
                });
                updateRequest.onsuccess = (event) => {
                    console.log('Settings updated successfully');
                };
            } else {
                const addRequest = settingsStore.add({
                    id: 'settings',
                    waterGoal: waterGoal,
                    activityLevel: activityLevel,
                    climate: climate
                });
                addRequest.onsuccess = (event) => {
                    console.log('Settings added successfully');
                };
            }
        };
    };
}

function loadSettings() {
    const db = indexedDB.open('hydration-reminder', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const settingsStore = db.transaction('settings', 'readonly').objectStore('settings');
        const request = settingsStore.get('settings');
        request.onsuccess = (event) => {
            const settings = event.target.result;
            if (settings) {
                const waterGoal = settings.waterGoal;
                const activityLevel = settings.activityLevel;
                const climate = settings.climate;
                if (waterGoal && activityLevel && climate) {
                    weightInput.value = waterGoal / WATER_GOAL_MULTIPLIER / ACTIVITY_LEVEL_MULTIPLIER[activityLevel] / CLIMATE_MULTIPLIER[climate];
                    activityLevelSelect.value = activityLevel;
                    climateSelect.value = climate;
                    const settingsSection = document.getElementById('settings');
                    settingsSection.classList.add('collapse');
                }
            }
        };
    };
}

function addReminder() {
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + 1);
    const reminder = {
        time: reminderTime,
        amount: calculateWaterGoal(weightInput.value, activityLevelSelect.value, climateSelect.value) / 4
    };
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();
}

function renderReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminderList.innerHTML = '';
    reminders.forEach((reminder, index) => {
        const reminderElement = document.createElement('li');
        reminderElement.textContent = `Drink ${reminder.amount} mL at ${reminder.time.toLocaleTimeString()}`;
        reminderList.appendChild(reminderElement);
    });
}

function logHydration(amount) {
    const logEntry = {
        timestamp: new Date(),
        amount: amount
    };
    const log = JSON.parse(localStorage.getItem('log')) || [];
    log.push(logEntry);
    localStorage.setItem('log', JSON.stringify(log));
    renderLog();
}

function renderLog() {
    const log = JSON.parse(localStorage.getItem('log')) || [];
    logList.innerHTML = '';
    log.forEach((entry, index) => {
        const logEntryElement = document.createElement('li');
        logEntryElement.textContent = `Drank ${entry.amount} mL at ${entry.timestamp.toLocaleTimeString()}`;
        logList.appendChild(logEntryElement);
    });
}

// Event listeners
settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveSettings();
});

saveSettingsButton.addEventListener('click', saveSettings);

addReminderButton.addEventListener('click', addReminder);

// Initialize app
loadSettings();
renderReminders();
renderLog();

// IndexedDB setup
const db = indexedDB.open('hydration-reminder', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('reminders', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('log', { keyPath: 'id', autoIncrement: true });
};

db.onsuccess = (event) => {
    const db = event.target.result;
    const remindersStore = db.transaction('reminders', 'readwrite').objectStore('reminders');
    const logStore = db.transaction('log', 'readwrite').objectStore('log');

    // Sync reminders with IndexedDB
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.forEach((reminder) => {
        remindersStore.add(reminder);
    });

    // Sync log with IndexedDB
    const log = JSON.parse(localStorage.getItem('log')) || [];
    log.forEach((entry) => {
        logStore.add(entry);
    });
};

// Weather API setup
const weatherAPIKey = 'YOUR_OPENWEATHERMAP_API_KEY';
const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${weatherAPIKey}`;

fetch(weatherAPIUrl)
    .then((response) => response.json())
    .then((weatherData) => {
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;

        // Adjust reminders based on weather
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.forEach((reminder) => {
            if (temperature > 25 || humidity < 60) {
                reminder.amount += 100; // Increase reminder amount by 100 mL
            }
        });
        localStorage.setItem('reminders', JSON.stringify(reminders));
        renderReminders();
    })
    .catch((error) => console.error(error));

// Fitness API setup (e.g. Fitbit)
const fitnessAPIKey = 'YOUR_FITBIT_API_KEY';
const fitnessAPIUrl = `https://api.fitbit.com/1/user/-/activities.json?access_token=${fitnessAPIKey}`;

fetch(fitnessAPIUrl)
    .then((response) => response.json())
    .then((fitnessData) => {
        const activityLevel = fitnessData.activities[0].activityLevel;

        // Adjust reminders based on activity level
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.forEach((reminder) => {
            if (activityLevel === 'high') {
                reminder.amount += 200; // Increase reminder amount by 200 mL
            }
        });
        localStorage.setItem('reminders', JSON.stringify(reminders));
        renderReminders();
    })
    .catch((error) => console.error(error));
