// Get references to HTML elements
const dashboard = document.getElementById('dashboard');
const schedules = document.getElementById('schedules');
const community = document.getElementById('community');
const moodEnergy = document.getElementById('mood-energy');
const fastingHours = document.getElementById('fasting-hours');
const eatingWindow = document.getElementById('eating-window');
const progressStreaks = document.getElementById('progress-streaks');
const scheduleForm = document.getElementById('schedule-form');
const saveSchedule = document.getElementById('save-schedule');
const communityQuestions = document.getElementById('community-questions');
const askQuestion = document.getElementById('ask-question');
const submitQuestion = document.getElementById('submit-question');
const moodEnergyForm = document.getElementById('mood-energy-form');
const logMoodEnergy = document.getElementById('log-mood-energy');

// Initialize IndexedDB
const db = indexedDB.open('intermittent-fasting-tracker', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('schedules', { keyPath: 'id' });
    db.createObjectStore('communityQuestions', { keyPath: 'id' });
    db.createObjectStore('moodEnergyLogs', { keyPath: 'id' });
};

// Initialize LocalStorage
const storage = window.localStorage;

// Load data from IndexedDB and LocalStorage
db.onsuccess = (event) => {
    const db = event.target.result;
    const schedulesStore = db.transaction('schedules', 'readonly').objectStore('schedules');
    const communityQuestionsStore = db.transaction('communityQuestions', 'readonly').objectStore('communityQuestions');
    const moodEnergyLogsStore = db.transaction('moodEnergyLogs', 'readonly').objectStore('moodEnergyLogs');

    schedulesStore.getAll().onsuccess = (event) => {
        const schedules = event.target.result;
        if (schedules.length > 0) {
            const schedule = schedules[0];
            storage.setItem('schedule', schedule.type);
            storage.setItem('fastingHours', schedule.fastingHours);
            storage.setItem('eatingWindow', schedule.eatingWindow);
        }
    };

    communityQuestionsStore.getAll().onsuccess = (event) => {
        const questions = event.target.result;
        communityQuestions.innerHTML = '';
        questions.forEach((question) => {
            const li = document.createElement('li');
            li.textContent = question.text;
            communityQuestions.appendChild(li);
        });
    };

    moodEnergyLogsStore.getAll().onsuccess = (event) => {
        const logs = event.target.result;
        moodEnergyForm.innerHTML = '';
        logs.forEach((log) => {
            const div = document.createElement('div');
            div.textContent = `Mood: ${log.mood}, Energy: ${log.energy}`;
            moodEnergyForm.appendChild(div);
        });
    };
};

// Handle schedule form submission
saveSchedule.addEventListener('click', (event) => {
    event.preventDefault();
    const scheduleType = scheduleForm.elements['schedule'].value;
    const fastingHours = scheduleForm.elements['fastingHours'].value;
    const eatingWindow = scheduleForm.elements['eatingWindow'].value;

    const schedule = {
        id: 1,
        type: scheduleType,
        fastingHours: fastingHours,
        eatingWindow: eatingWindow,
    };

    const db = indexedDB.open('intermittent-fasting-tracker', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const schedulesStore = db.transaction('schedules', 'readwrite').objectStore('schedules');
        schedulesStore.put(schedule);
    };

    storage.setItem('schedule', scheduleType);
    storage.setItem('fastingHours', fastingHours);
    storage.setItem('eatingWindow', eatingWindow);

    dashboard.innerHTML = '';
    const fastingHoursDiv = document.createElement('div');
    fastingHoursDiv.textContent = `Fasting Hours: ${fastingHours}`;
    dashboard.appendChild(fastingHoursDiv);
    const eatingWindowDiv = document.createElement('div');
    eatingWindowDiv.textContent = `Eating Window: ${eatingWindow}`;
    dashboard.appendChild(eatingWindowDiv);
});

// Handle community question submission
submitQuestion.addEventListener('click', (event) => {
    event.preventDefault();
    const questionText = askQuestion.elements['question'].value;

    const question = {
        id: Date.now(),
        text: questionText,
    };

    const db = indexedDB.open('intermittent-fasting-tracker', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const communityQuestionsStore = db.transaction('communityQuestions', 'readwrite').objectStore('communityQuestions');
        communityQuestionsStore.put(question);
    };

    communityQuestions.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = questionText;
    communityQuestions.appendChild(li);
});

// Handle mood and energy log submission
logMoodEnergy.addEventListener('click', (event) => {
    event.preventDefault();
    const mood = moodEnergyForm.elements['mood'].value;
    const energy = moodEnergyForm.elements['energy'].value;

    const log = {
        id: Date.now(),
        mood: mood,
        energy: energy,
    };

    const db = indexedDB.open('intermittent-fasting-tracker', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const moodEnergyLogsStore = db.transaction('moodEnergyLogs', 'readwrite').objectStore('moodEnergyLogs');
        moodEnergyLogsStore.put(log);
    };

    moodEnergyForm.innerHTML = '';
    const div = document.createElement('div');
    div.textContent = `Mood: ${mood}, Energy: ${energy}`;
    moodEnergyForm.appendChild(div);
});
