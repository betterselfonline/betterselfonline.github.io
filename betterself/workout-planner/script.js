// Get references to HTML elements
const workoutPlanList = document.getElementById('workout-plan-list');
const settingsForm = document.getElementById('settings-form');
const goalSelect = document.getElementById('goal');
const equipmentSelect = document.getElementById('equipment');
const fitnessLevelSelect = document.getElementById('fitness-level');
const saveSettingsButton = document.getElementById('save-settings');

// Initialize IndexedDB
const db = indexedDB.open('workout-planner', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('workout-plans', { keyPath: 'id' });
};

// Initialize LocalStorage
const storage = window.localStorage;

// Load settings from LocalStorage
const storedSettings = storage.getItem('settings');
if (storedSettings) {
    const settings = JSON.parse(storedSettings);
    goalSelect.value = settings.goal;
    equipmentSelect.value = settings.equipment;
    fitnessLevelSelect.value = settings.fitnessLevel;
}

// Save settings to LocalStorage
saveSettingsButton.addEventListener('click', () => {
    const settings = {
        goal: goalSelect.value,
        equipment: equipmentSelect.value,
        fitnessLevel: fitnessLevelSelect.value,
    };
    storage.setItem('settings', JSON.stringify(settings));
});

// Generate workout plans based on user settings
const generateWorkoutPlans = () => {
    const settings = {
        goal: goalSelect.value,
        equipment: equipmentSelect.value,
        fitnessLevel: fitnessLevelSelect.value,
    };
    // TO DO: implement logic to generate workout plans based on user settings
    // For now, just generate some dummy plans
    const plans = [
        { id: 1, name: 'Plan 1', description: 'This is plan 1' },
        { id: 2, name: 'Plan 2', description: 'This is plan 2' },
        { id: 3, name: 'Plan 3', description: 'This is plan 3' },
    ];
    return plans;
};

// Display workout plans
const displayWorkoutPlans = () => {
    const plans = generateWorkoutPlans();
    workoutPlanList.innerHTML = '';
    plans.forEach((plan) => {
        const li = document.createElement('li');
        li.textContent = plan.name;
        workoutPlanList.appendChild(li);
    });
};

// Display workout plans on page load
displayWorkoutPlans();
