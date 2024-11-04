// Get references to HTML elements
const goalForm = document.getElementById('goal-form');
const goalList = document.getElementById('goal-list');
const promptList = document.getElementById('prompt-list');
const milestoneList = document.getElementById('milestone-list');
const progressChart = document.getElementById('progress-chart');
const shareGoalBtn = document.getElementById('share-goal-btn');
const sharedGoalList = document.getElementById('shared-goal-list');

// Initialize IndexedDB
const db = indexedDB.open('goal-setting-journal', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('goals', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('prompts', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('milestones', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('shared-goals', { keyPath: 'id', autoIncrement: true });
};

// Initialize LocalStorage
const storage = window.localStorage;

// Function to create a new goal
function createGoal(title, description, targetDate) {
    const goal = {
        title,
        description,
        targetDate,
        progress: 0,
    };
    const transaction = db.transaction('goals', 'readwrite');
    const goalsStore = transaction.objectStore('goals');
    const request = goalsStore.add(goal);
    request.onsuccess = () => {
        console.log('Goal created successfully!');
        displayGoals();
    };
    request.onerror = (event) => {
        console.error('Error creating goal:', event.target.error);
    };
}

// Function to display goals
function displayGoals() {
    const transaction = db.transaction('goals', 'readonly');
    const goalsStore = transaction.objectStore('goals');
    const request = goalsStore.getAll();
    request.onsuccess = () => {
        const goals = request.result;
        goalList.innerHTML = '';
        goals.forEach((goal) => {
            const li = document.createElement('li');
            li.textContent = `${goal.title} - ${goal.description} - ${goal.targetDate}`;
            goalList.appendChild(li);
        });
    };
    request.onerror = (event) => {
        console.error('Error displaying goals:', event.target.error);
    };
}

// Function to create a new prompt
function createPrompt(text) {
    const prompt = {
        text,
        date: new Date(),
    };
    const transaction = db.transaction('prompts', 'readwrite');
    const promptsStore = transaction.objectStore('prompts');
    const request = promptsStore.add(prompt);
    request.onsuccess = () => {
        console.log('Prompt created successfully!');
        displayPrompts();
    };
    request.onerror = (event) => {
        console.error('Error creating prompt:', event.target.error);
    };
}

// Function to display prompts
function displayPrompts() {
    const transaction = db.transaction('prompts', 'readonly');
    const promptsStore = transaction.objectStore('prompts');
    const request = promptsStore.getAll();
    request.onsuccess = () => {
        const prompts = request.result;
        promptList.innerHTML = '';
        prompts.forEach((prompt) => {
            const li = document.createElement('li');
            li.textContent = `${prompt.text} - ${prompt.date.toLocaleDateString()}`;
            promptList.appendChild(li);
        });
    };
    request.onerror = (event) => {
        console.error('Error displaying prompts:', event.target.error);
    };
}

// Function to create a new milestone
function createMilestone(text, date) {
    const milestone = {
        text,
        date,
    };
    const transaction = db.transaction('milestones', 'readwrite');
    const milestonesStore = transaction.objectStore('milestones');
    const request = milestonesStore.add(milestone);
    request.onsuccess = () => {
        console.log('Milestone created successfully!');
        displayMilestones();
    };
    request.onerror = (event) => {
        console.error('Error creating milestone:', event.target.error);
    };
}

// Function to display milestones
function displayMilestones() {
    const transaction = db.transaction('milestones', 'readonly');
    const milestonesStore = transaction.objectStore('milestones');
    const request = milestonesStore.getAll();
    request.onsuccess = () => {
        const milestones = request.result;
        milestoneList.innerHTML = '';
        milestones.forEach((milestone) => {
            const li = document.createElement('li');
            li.textContent = `${milestone.text} - ${milestone.date.toLocaleDateString()}`;
            milestoneList.appendChild(li);
        });
    };
    request.onerror = (event) => {
        console.error('Error displaying milestones:', event.target.error);
    };
}

// Function to share a goal
function shareGoal(goal) {
    const sharedGoal = {
        title: goal.title,
        description: goal.description,
        targetDate: goal.targetDate,
    };
    const transaction = db.transaction('shared-goals', 'readwrite');
    const sharedGoalsStore = transaction.objectStore('shared-goals');
    const request = sharedGoalsStore.add(sharedGoal);
    request.onsuccess = () => {
        console.log('Goal shared successfully!');
        displaySharedGoals();
    };
    request.onerror = (event) => {
        console.error('Error sharing goal:', event.target.error);
    };
}

// Function to display shared goals
function displaySharedGoals() {
    const transaction = db.transaction('shared-goals', 'readonly');
    const sharedGoalsStore = transaction.objectStore('shared-goals');
    const request = sharedGoalsStore.getAll();
    request.onsuccess = () => {
        const sharedGoals = request.result;
        sharedGoalList.innerHTML = '';
        sharedGoals.forEach((sharedGoal) => {
            const li = document.createElement('li');
            li.textContent = `${sharedGoal.title} - ${sharedGoal.description} - ${sharedGoal.targetDate}`;
            sharedGoalList.appendChild(li);
        });
    };
    request.onerror = (event) => {
        console.error('Error displaying shared goals:', event.target.error);
    };
}

// Event listeners
goalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('goal-title').value;
    const description = document.getElementById('goal-description').value;
    const targetDate = document.getElementById('goal-target-date').value;
    createGoal(title, description, targetDate);
});

shareGoalBtn.addEventListener('click', () => {
    const goal = {
        title: 'Example Goal',
        description: 'This is an example goal',
        targetDate: '2023-03-16',
    };
    shareGoal(goal);
});

// Initialize app
displayGoals();
displayPrompts();
displayMilestones();
displaySharedGoals();
