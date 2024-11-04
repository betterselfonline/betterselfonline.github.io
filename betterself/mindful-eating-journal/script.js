// Get references to HTML elements
const logMealBtn = document.getElementById('log-meal-btn');
const viewAnalyticsBtn = document.getElementById('view-analytics-btn');
const viewRemindersBtn = document.getElementById('view-reminders-btn');
const logMealForm = document.getElementById('log-meal-form');
const mealNoteInput = document.getElementById('meal-note');
const mealPhotoInput = document.getElementById('meal-photo');
const saveMealBtn = document.getElementById('save-meal-btn');
const emotionalTagsContainer = document.getElementById('emotional-tags');
const analyticsContainer = document.getElementById('analytics-container');
const remindersContainer = document.getElementById('reminder-container');
const reflectionPromptsContainer = document.getElementById('reflection-prompt-container');

// Set up IndexedDB for storing user-generated data
const db = indexedDB.open('mindful-eating-journal', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('meals', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('reminders', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('reflection-prompts', { keyPath: 'id', autoIncrement: true });
};

// Set up LocalStorage for storing user preferences
const userPreferences = localStorage.getItem('userPreferences');
if (!userPreferences) {
    localStorage.setItem('userPreferences', JSON.stringify({}));
}

// Log meal functionality
logMealBtn.addEventListener('click', () => {
    logMealForm.style.display = 'block';
});

saveMealBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const mealNote = mealNoteInput.value;
    const mealPhoto = mealPhotoInput.files[0];
    const emotionalTags = Array.from(emotionalTagsContainer.children).filter((tag) => tag.classList.contains('active')).map((tag) => tag.dataset.tag);
    const mealData = { note: mealNote, photo: mealPhoto, emotionalTags };
    const transaction = db.transaction(['meals'], 'readwrite');
    const mealsStore = transaction.objectStore('meals');
    const mealRequest = mealsStore.add(mealData);
    mealRequest.onsuccess = () => {
        console.log('Meal saved successfully!');
        logMealForm.style.display = 'none';
        mealNoteInput.value = '';
        mealPhotoInput.value = '';
        emotionalTagsContainer.innerHTML = '';
    };
    mealRequest.onerror = (event) => {
        console.error('Error saving meal:', event.target.error);
    };
});

// View analytics functionality
viewAnalyticsBtn.addEventListener('click', () => {
    analyticsContainer.style.display = 'block';
    const transaction = db.transaction(['analytics'], 'readonly');
    const analyticsStore = transaction.objectStore('analytics');
    const analyticsRequest = analyticsStore.getAll();
    analyticsRequest.onsuccess = () => {
        const analyticsData = analyticsRequest.result;
        const analyticsHTML = analyticsData.map((analytic) => {
            return `
        <div>
          <h3>${analytic.name}</h3>
          <p>${analytic.description}</p>
        </div>
      `;
        }).join('');
        analyticsContainer.innerHTML = analyticsHTML;
    };
    analyticsRequest.onerror = (event) => {
        console.error('Error loading analytics:', event.target.error);
    };
});

// View reminders functionality
viewRemindersBtn.addEventListener('click', () => {
    remindersContainer.style.display = 'block';
    const transaction = db.transaction(['reminders'], 'readonly');
    const remindersStore = transaction.objectStore('reminders');
    const remindersRequest = remindersStore.getAll();
    remindersRequest.onsuccess = () => {
        const remindersData = remindersRequest.result;
        const remindersHTML = remindersData.map((reminder) => {
            return `
        <div>
          <h3>${reminder.name}</h3>
          <p>${reminder.description}</p>
        </div>
      `;
        }).join('');
        remindersContainer.innerHTML = remindersHTML;
    };
    remindersRequest.onerror = (event) => {
        console.error('Error loading reminders:', event.target.error);
    };
});

// Reflection prompts functionality
reflectionPromptsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('reflection-prompt')) {
        const promptId = event.target.dataset.promptId;
        const transaction = db.transaction(['reflection-prompts'], 'readonly');
        const reflectionPromptsStore = transaction.objectStore('reflection-prompts');
        const reflectionPromptRequest = reflectionPromptsStore.get(promptId);
        reflectionPromptRequest.onsuccess = () => {
            const reflectionPromptData = reflectionPromptRequest.result;
            const reflectionPromptHTML = `
        <div>
          <h3>${reflectionPromptData.name}</h3>
          <p>${reflectionPromptData.description}</p>
        </div>
      `;
            reflectionPromptsContainer.innerHTML = reflectionPromptHTML;
        };
        reflectionPromptRequest.onerror = (event) => {
            console.error('Error loading reflection prompt:', event.target.error);
        };
    }
});

// Emotional tags functionality
emotionalTagsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('tag-btn')) {
        const tag = event.target.dataset.tag;
        const emotionalTags = Array.from(emotionalTagsContainer.children).filter((tag) => tag.classList.contains('active')).map((tag) => tag.dataset.tag);
        if (emotionalTags.includes(tag)) {
            event.target.classList.remove('active');
        } else {
            event.target.classList.add('active');
        }
    }
});

// Initialize app
db.onready = () => {
    console.log('Database ready!');
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences'));
    if (userPreferences) {
        // Load user preferences
    }
};
