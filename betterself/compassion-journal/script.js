// Initialize IndexedDB
const db = indexedDB.open('self-compassion-journal', 1);

db.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore('prompts', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('reflections', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('reminders', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('visuals', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('insights', { keyPath: 'id', autoIncrement: true });
};

db.onsuccess = event => {
    console.log('IndexedDB initialized');
};

// Initialize LocalStorage
const storage = window.localStorage;

// Function to get user preferences from LocalStorage
function getUserPreferences() {
    const preferences = storage.getItem('userPreferences');
    return preferences ? JSON.parse(preferences) : {};
}

// Function to save user preferences to LocalStorage
function saveUserPreferences(preferences) {
    storage.setItem('userPreferences', JSON.stringify(preferences));
}

// Function to get daily compassion prompts from IndexedDB
function getDailyCompassionPrompts() {
    const promptsStore = db.transaction('prompts', 'readonly').objectStore('prompts');
    const prompts = [];
    promptsStore.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            prompts.push(cursor.value);
            cursor.continue();
        }
    };
    return prompts;
}

// Function to add new daily compassion prompt to IndexedDB
function addDailyCompassionPrompt(prompt) {
    const promptsStore = db.transaction('prompts', 'readwrite').objectStore('prompts');
    promptsStore.add(prompt);
}

// Function to get self-reflection questions from IndexedDB
function getSelfReflectionQuestions() {
    const reflectionsStore = db.transaction('reflections', 'readonly').objectStore('reflections');
    const reflections = [];
    reflectionsStore.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            reflections.push(cursor.value);
            cursor.continue();
        }
    };
    return reflections;
}

// Function to add new self-reflection question to IndexedDB

// Function to get self-kindness reminders from IndexedDB
function getSelfKindnessReminders() {
    const remindersStore = db.transaction('reminders', 'readonly').objectStore('reminders');
    const reminders = [];
    remindersStore.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            reminders.push(cursor.value);
            cursor.continue();
        }
    };
    return reminders;
}

// Function to add new self-kindness reminder to IndexedDB
function addSelfKindnessReminder(reminder) {
    const remindersStore = db.transaction('reminders', 'readwrite').objectStore('reminders');
    remindersStore.add(reminder);
}

// Function to get compassionate visuals and affirmations from IndexedDB
function getCompassionateVisualsAndAffirmations() {
    const visualsStore = db.transaction('visuals', 'readonly').objectStore('visuals');
    const visuals = [];
    visualsStore.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            visuals.push(cursor.value);
            cursor.continue();
        }
    };
    return visuals;
}

// Function to add new compassionate visual and affirmation to IndexedDB
function addCompassionateVisualAndAffirmation(visual) {
    const visualsStore = db.transaction('visuals', 'readwrite').objectStore('visuals');
    visualsStore.add(visual);
}

// Function to get insights from IndexedDB
function getInsights() {
    const insightsStore = db.transaction('insights', 'readonly').objectStore('insights');
    const insights = [];
    insightsStore.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            insights.push(cursor.value);
            cursor.continue();
        }
    };
    return insights;
}

// Function to add new insight to IndexedDB
function addInsight(insight) {
    const insightsStore = db.transaction('insights', 'readwrite').objectStore('insights');
    insightsStore.add(insight);
}

// Event listeners for buttons
document.getElementById('new-prompt-btn').addEventListener('click', () => {
    const prompt = prompt('Enter a daily compassion prompt:');
    if (prompt) {
        addDailyCompassionPrompt({ prompt: prompt, date: new Date().toISOString() });
        const promptsList = document.getElementById('prompts-list');
        const newPrompt = document.createElement('li');
        newPrompt.textContent = prompt;
        promptsList.appendChild(newPrompt);
    }
});

document.getElementById('new-reflection-btn').addEventListener('click', () => {
    const reflection = prompt('Enter a self-reflection question:');
    if (reflection) {
        addSelfReflectionQuestion({ reflection: reflection, date: new Date().toISOString() });
        const reflectionsList = document.getElementById('reflection-list');
        const newReflection = document.createElement('li');
        newReflection.textContent = reflection;
        reflectionsList.appendChild(newReflection);
    }
});

document.getElementById('new-reminder-btn').addEventListener('click', () => {
    const reminder = prompt('Enter a self-kindness reminder:');
    if (reminder) {
        addSelfKindnessReminder({ reminder: reminder, date: new Date().toISOString() });
        const remindersList = document.getElementById('reminders-list');
        const newReminder = document.createElement('li');
        newReminder.textContent = reminder;
        remindersList.appendChild(newReminder);
    }
});

// Render initial data
const prompts = getDailyCompassionPrompts();
const reflections = getSelfReflectionQuestions();
const reminders = getSelfKindnessReminders();
const visuals = getCompassionateVisualsAndAffirmations();
const insights = getInsights();

prompts.forEach(prompt => {
    const promptsList = document.getElementById('prompts-list');
    const newPrompt = document.createElement('li');
    newPrompt.textContent = prompt.prompt;
    promptsList.appendChild(newPrompt);
});

reflections.forEach(reflection => {
    const reflectionsList = document.getElementById('reflection-list');
    const newReflection = document.createElement('li');
    newReflection.textContent = reflection.reflection;
    reflectionsList.appendChild(newReflection);
});

reminders.forEach(reminder => {
    const remindersList = document.getElementById('reminders-list');
    const newReminder = document.createElement('li');
    newReminder.textContent = reminder.reminder;
    remindersList.appendChild(newReminder);
});

visuals.forEach(visual => {
    const visualsContainer = document.getElementById('visuals-container');
    const newVisual = document.createElement('img');
    newVisual.src = visual.visual;
    newVisual.alt = visual.affirmation;
    visualsContainer.appendChild(newVisual);
});

insights.forEach(insight => {
    const insightsContainer = document.getElementById('insights-container');
    const newInsight = document.createElement('h3');
    newInsight.textContent = insight.insight;
    insightsContainer.appendChild(newInsight);
});
