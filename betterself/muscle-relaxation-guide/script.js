// Get references to HTML elements
const startSessionButton = document.getElementById('start-session');
const sessionLengthSelect = document.getElementById('session-length');
const preSessionMoodSelect = document.getElementById('pre-session-mood');
const postSessionMoodSelect = document.getElementById('post-session-mood');
const backgroundSoundSelect = document.getElementById('background-sound');
const scheduleFrequencySelect = document.getElementById('schedule-frequency');
const scheduleTimeInput = document.getElementById('schedule-time');

// Initialize LocalStorage and IndexedDB
const localStorage = window.localStorage;
const indexedDB = window.indexedDB;

// Define constants for LocalStorage keys and IndexedDB database name
const LOCAL_STORAGE_KEY_SESSION_LENGTH = 'sessionLength';
const LOCAL_STORAGE_KEY_PRE_SESSION_MOOD = 'preSessionMood';
const LOCAL_STORAGE_KEY_POST_SESSION_MOOD = 'postSessionMood';
const LOCAL_STORAGE_KEY_BACKGROUND_SOUND = 'backgroundSound';
const LOCAL_STORAGE_KEY_SCHEDULE_FREQUENCY = 'scheduleFrequency';
const LOCAL_STORAGE_KEY_SCHEDULE_TIME = 'scheduleTime';

const INDEXED_DB_NAME = 'pmr-data';
const INDEXED_DB_VERSION = 1;

// Define functions for handling user input and updating LocalStorage and IndexedDB
function handleStartSessionButtonClick() {
    const sessionLength = sessionLengthSelect.value;
    const preSessionMood = preSessionMoodSelect.value;
    const postSessionMood = postSessionMoodSelect.value;
    const backgroundSound = backgroundSoundSelect.value;
    const scheduleFrequency = scheduleFrequencySelect.value;
    const scheduleTime = scheduleTimeInput.value;

    // Update LocalStorage
    localStorage.setItem(LOCAL_STORAGE_KEY_SESSION_LENGTH, sessionLength);
    localStorage.setItem(LOCAL_STORAGE_KEY_PRE_SESSION_MOOD, preSessionMood);
    localStorage.setItem(LOCAL_STORAGE_KEY_POST_SESSION_MOOD, postSessionMood);
    localStorage.setItem(LOCAL_STORAGE_KEY_BACKGROUND_SOUND, backgroundSound);
    localStorage.setItem(LOCAL_STORAGE_KEY_SCHEDULE_FREQUENCY, scheduleFrequency);
    localStorage.setItem(LOCAL_STORAGE_KEY_SCHEDULE_TIME, scheduleTime);

    // Update IndexedDB
    const db = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
    db.onsuccess = () => {
        const tx = db.result.transaction('pmr-data', 'readwrite');
        const store = tx.objectStore('pmr-data');
        store.put({
            sessionLength: sessionLength,
            preSessionMood: preSessionMood,
            postSessionMood: postSessionMood,
            backgroundSound: backgroundSound,
            scheduleFrequency: scheduleFrequency,
            scheduleTime: scheduleTime
        });
    };
}

// Add event listeners to HTML elements
startSessionButton.addEventListener('click', handleStartSessionButtonClick);

// Initialize IndexedDB database and object store
indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION).onsuccess = () => {
    const db = indexedDB.result;
    const tx = db.transaction('pmr-data', 'readwrite');
    const store = tx.objectStore('pmr-data');
    store.createIndex('sessionLength', 'sessionLength', { unique: false });
    store.createIndex('preSessionMood', 'preSessionMood', { unique: false });
    store.createIndex('postSessionMood', 'postSessionMood', { unique: false });
    store.createIndex('backgroundSound', 'backgroundSound', { unique: false });
    store.createIndex('scheduleFrequency', 'scheduleFrequency', { unique: false });
    store.createIndex('scheduleTime', 'scheduleTime', { unique: false });
};

// Define function to play audio-guided session
function playAudioGuidedSession(sessionLength) {
    const audio = new Audio('audio/guided-session.mp3');
    audio.play();
    setTimeout(() => {
        audio.pause();
    }, sessionLength * 60 * 1000);
}

// Define function to update mood tracker
function updateMoodTracker(preSessionMood, postSessionMood) {
    const moodTracker = document.getElementById('mood-tracker');
    moodTracker.innerHTML = `
        <p>Pre-Session Mood: ${preSessionMood}</p>
        <p>Post-Session Mood: ${postSessionMood}</p>
    `;
}

// Define function to update background sound
function updateBackgroundSound(backgroundSound) {
    const backgroundSoundElement = document.getElementById('background-sound');
    backgroundSoundElement.src = `audio/${backgroundSound}.mp3`;
    backgroundSoundElement.play();
}

// Define function to update routine scheduler
function updateRoutineScheduler(scheduleFrequency, scheduleTime) {
    const routineScheduler = document.getElementById('routine-scheduler');
    routineScheduler.innerHTML = `
        <p>Schedule Frequency: ${scheduleFrequency}</p>
        <p>Schedule Time: ${scheduleTime}</p>
    `;
}

// Define function to handle guided session completion
function handleGuidedSessionCompletion() {
    const sessionLength = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION_LENGTH);
    const preSessionMood = localStorage.getItem(LOCAL_STORAGE_KEY_PRE_SESSION_MOOD);
    const postSessionMood = localStorage.getItem(LOCAL_STORAGE_KEY_POST_SESSION_MOOD);
    const backgroundSound = localStorage.getItem(LOCAL_STORAGE_KEY_BACKGROUND_SOUND);
    const scheduleFrequency = localStorage.getItem(LOCAL_STORAGE_KEY_SCHEDULE_FREQUENCY);
    const scheduleTime = localStorage.getItem(LOCAL_STORAGE_KEY_SCHEDULE_TIME);

    updateMoodTracker(preSessionMood, postSessionMood);
    updateBackgroundSound(backgroundSound);
    updateRoutineScheduler(scheduleFrequency, scheduleTime);
}

// Add event listener to guided session completion
document.addEventListener('guidedSessionCompletion', handleGuidedSessionCompletion);

// Define function to handle routine scheduler completion
function handleRoutineSchedulerCompletion() {
    const scheduleFrequency = localStorage.getItem(LOCAL_STORAGE_KEY_SCHEDULE_FREQUENCY);
    const scheduleTime = localStorage.getItem(LOCAL_STORAGE_KEY_SCHEDULE_TIME);

    updateRoutineScheduler(scheduleFrequency, scheduleTime);
}

// Add event listener to routine scheduler completion
document.addEventListener('routineSchedulerCompletion', handleRoutineSchedulerCompletion);
