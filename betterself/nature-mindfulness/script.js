// LocalStorage for user preferences
const storage = window.localStorage;

// IndexedDB for user-generated data
const db = window.indexedDB.open('nature-mindfulness', 1);

db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('moodLog', { keyPath: 'id', autoIncrement: true });
};

db.onsuccess = (event) => {
    console.log('Database opened successfully');
};

// Play sounds, meditations, and views
document.querySelectorAll('.play-sound, .play-meditation, .play-view').forEach((button) => {
    button.addEventListener('click', (event) => {
        const audioOrVideo = event.target.nextElementSibling;
        audioOrVideo.play();
    });
});

// Log mood
document.querySelector('.log-mood').addEventListener('click', (event) => {
    const mood = document.querySelector('#mood').value;
    const logEntry = {
        id: Date.now(),
        mood: mood,
    };

    // Add log entry to IndexedDB
    const transaction = db.transaction(['moodLog'], 'readwrite');
    const store = transaction.objectStore('moodLog');
    const request = store.add(logEntry);

    request.onsuccess = (event) => {
        console.log('Log entry added successfully');
        displayMoodLog();
    };

    request.onerror = (event) => {
        console.log('Error adding log entry:', event.target.error);
    };
});

// Display mood log
function displayMoodLog() {
    const moodLogList = document.querySelector('.mood-log');
    moodLogList.innerHTML = '';

    const transaction = db.transaction(['moodLog'], 'readonly');
    const store = transaction.objectStore('moodLog');
    const request = store.getAll();

    request.onsuccess = (event) => {
        const logEntries = event.target.result;
        logEntries.forEach((entry) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.mood} - ${new Date(entry.id).toLocaleString()}`;
            moodLogList.appendChild(listItem);
        });
    };

    request.onerror = (event) => {
        console.log('Error retrieving log entries:', event.target.error);
    };
}

// Set daily reminder
document.querySelector('.set-reminder').addEventListener('click', (event) => {
    const reminderTime = document.querySelector('#reminder-time').value;
    storage.setItem('reminderTime', reminderTime);

    // Set reminder notification
    const notification = new Notification('Daily Reminder', {
        body: `Remember to take a few minutes to relax and enjoy nature at ${reminderTime}`,
    });
});

// Check for reminder notification
if (storage.getItem('reminderTime')) {
    const reminderTime = storage.getItem('reminderTime');
    const notification = new Notification('Daily Reminder', {
        body: `Remember to take a few minutes to relax and enjoy nature at ${reminderTime}`,
    });
}

// Offline support
window.addEventListener('online', (event) => {
    console.log('Online');
});

window.addEventListener('offline', (event) => {
    console.log('Offline');
});

