// Core Values Assessment
const valuesList = document.getElementById('values-list');
const startAssessmentButton = document.getElementById('start-assessment');

startAssessmentButton.addEventListener('click', () => {
    // generate values list dynamically
    const values = ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5'];
    valuesList.innerHTML = '';
    values.forEach((value) => {
        const li = document.createElement('li');
        li.textContent = value;
        valuesList.appendChild(li);
    });
});

// Goal and Action Tracking
const goalForm = document.getElementById('goal-form');
const goalInput = document.getElementById('goal-input');
const valueSelect = document.getElementById('value-select');
const addGoalButton = document.getElementById('add-goal');
const goalList = document.getElementById('goal-list');

goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goal = goalInput.value;
    const value = valueSelect.value;
    // add goal to list and store in IndexedDB
    const goalObject = { goal, value };
    const db = indexedDB.open('values-alignment-tracker', 1);
    db.onsuccess = () => {
        const transaction = db.result.transaction('goals', 'readwrite');
        const goalsStore = transaction.objectStore('goals');
        goalsStore.add(goalObject);
        goalList.innerHTML += `<li>${goal} (${value})</li>`;
    };
});

// Weekly Reflection Prompts
const reflectionList = document.getElementById('reflection-list');

// generate reflection prompts dynamically
const reflectionPrompts = ['Reflection Prompt 1', 'Reflection Prompt 2', 'Reflection Prompt 3'];
reflectionList.innerHTML = '';
reflectionPrompts.forEach((prompt) => {
    const li = document.createElement('li');
    li.textContent = prompt;
    reflectionList.appendChild(li);
});

// Values-based Analytics
const valuesChart = document.getElementById('values-chart');

// generate chart dynamically
const chartData = [10, 20, 30, 40, 50];
const chart = new Chart(valuesChart, {
    type: 'bar',
    data: {
        labels: ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5'],
        datasets: [{
            label: 'Values Alignment',
            data: chartData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
            ],
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

// Habit Formation Recommendations
const habitList = document.getElementById('habit-list');

// generate habit recommendations dynamically
const habitRecommendations = ['Habit Recommendation 1', 'Habit Recommendation 2', 'Habit Recommendation 3'];
habitList.innerHTML = '';
habitRecommendations.forEach((recommendation) => {
    const li = document.createElement('li');
    li.textContent = recommendation;
    habitList.appendChild(li);
});

// LocalStorage for user preferences
const userPreferences = localStorage.getItem('userPreferences');
if (!userPreferences) {
    const defaultPreferences = {
        values: ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5'],
        goals: []
    };
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
}

// IndexedDB for user-generated data
const db = indexedDB.open('values-alignment-tracker', 1);
db.onsuccess = () => {
    const transaction = db.result.transaction('goals', 'readwrite');
    const goalsStore = transaction.objectStore('goals');
    goalsStore.getAll().onsuccess = (event) => {
        const goals = event.target.result;
        console.log(goals);
    };
};
