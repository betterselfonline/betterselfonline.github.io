// get references to HTML elements
const promptsSection = document.getElementById('prompts');
const entryForm = document.getElementById('entry-form');
const analyticsSection = document.getElementById('analytics');
const shareSection = document.getElementById('share');
const moodChart = document.getElementById('mood-chart');
const shareButton = document.getElementById('share-button');

// set up IndexedDB for storing user-generated data
const db = indexedDB.open('gratitude-journal', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
};

// set up LocalStorage for storing user preferences
const preferences = localStorage.getItem('preferences');
if (!preferences) {
    localStorage.setItem('preferences', JSON.stringify({}));
}

// generate daily prompts
const prompts = [
    'What are you grateful for today?',
    'What made you smile today?',
    'What are you looking forward to tomorrow?',
    // add more prompts here...
];
promptsSection.innerHTML = '';
prompts.forEach((prompt) => {
    const li = document.createElement('li');
    li.textContent = prompt;
    promptsSection.appendChild(li);
});

// handle entry form submission
entryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const moodBefore = document.getElementById('mood-before').value;
    const entryText = document.getElementById('entry-text').value;
    const photo = document.getElementById('photo').files[0];
    const entry = {
        id: Date.now(),
        moodBefore,
        entryText,
        photo,
    };
    // store entry in IndexedDB
    const transaction = db.transaction('entries', 'readwrite');
    const entriesStore = transaction.objectStore('entries');
    entriesStore.add(entry);
    // update analytics
    updateAnalytics();
});

// update analytics
function updateAnalytics() {
    const entriesStore = db.transaction('entries', 'readonly').objectStore('entries');
    const entries = [];
    entriesStore.getAll().onsuccess = (event) => {
        entries = event.target.result;
        const moodData = entries.map((entry) => {
            return {
                date: new Date(entry.id),
                moodBefore: entry.moodBefore,
            };
        });
        // render mood chart
        renderMoodChart(moodData);
    };
}

// render mood chart
function renderMoodChart(moodData) {
    const ctx = moodChart.getContext('2d');
    ctx.clearRect(0, 0, moodChart.width, moodChart.height);
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodData.map((data) => data.date.toLocaleDateString()),
            datasets: [{
                label: 'Mood Before',
                data: moodData.map((data) => data.moodBefore),
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
}

// handle share button click
shareButton.addEventListener('click', () => {
    const entryText = document.getElementById('entry-text').value;
    const photo = document.getElementById('photo').files[0];
    if (photo) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            const shareData = {
                text: entryText,
                image: imageData
            };
            navigator.share(shareData);
        };
        reader.readAsDataURL(photo);
    } else {
        navigator.share({ text: entryText });
    }
});

// initialize app
db.onsuccess = () => {
    updateAnalytics();
};
