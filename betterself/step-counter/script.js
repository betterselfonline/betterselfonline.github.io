// Initialize variables
let stepCount = 0;
let dailyGoal = 10000;
let caloricBurn = 0;
let distanceTracked = 0;
let challengeList = [];
let recommendationList = [];
let streakCount = 0;

// Initialize LocalStorage
if (localStorage.getItem('dailyGoal') === null) {
    localStorage.setItem('dailyGoal', dailyGoal);
}

// Initialize IndexedDB
const db = indexedDB.open('step-counter', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('steps', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('challenges', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('recommendations', { keyPath: 'id', autoIncrement: true });
};

// Get user preferences from LocalStorage
dailyGoal = parseInt(localStorage.getItem('dailyGoal'));

// Get user-generated data from IndexedDB
db.onsuccess = (event) => {
    const db = event.target.result;
    const stepsStore = db.transaction('steps', 'readonly').objectStore('steps');
    const challengesStore = db.transaction('challenges', 'readonly').objectStore('challenges');
    const recommendationsStore = db.transaction('recommendations', 'readonly').objectStore('recommendations');

    stepsStore.getAll().onsuccess = (event) => {
        const steps = event.target.result;
        stepCount = steps.length;
        document.getElementById('step-count').textContent = stepCount;
    };

    challengesStore.getAll().onsuccess = (event) => {
        const challenges = event.target.result;
        challengeList = challenges;
        const challengeListElement = document.getElementById('challenge-list');
        challengeListElement.innerHTML = '';
        challenges.forEach((challenge) => {
            const challengeElement = document.createElement('li');
            challengeElement.textContent = challenge.name;
            challengeListElement.appendChild(challengeElement);
        });
    };

    recommendationsStore.getAll().onsuccess = (event) => {
        const recommendations = event.target.result;
        recommendationList = recommendations;
        const recommendationListElement = document.getElementById('recommendation-list');
        recommendationListElement.innerHTML = '';
        recommendations.forEach((recommendation) => {
            const recommendationElement = document.createElement('li');
            recommendationElement.textContent = recommendation.name;
            recommendationListElement.appendChild(recommendationElement);
        });
    };
};

// Event listeners
document.getElementById('start-stop-button').addEventListener('click', () => {
    // Start/stop step tracking
    if (stepCount === 0) {
        // Start tracking
        stepCount = 1;
        document.getElementById('step-count').textContent = stepCount;
        // Update IndexedDB
        const db = indexedDB.open('step-counter', 1);
        db.onsuccess = (event) => {
            const db = event.target.result;
            const stepsStore = db.transaction('steps', 'readwrite').objectStore('steps');
            stepsStore.add({ id: stepCount });
        };
    } else {
        // Stop tracking
        stepCount = 0;
        document.getElementById('step-count').textContent = stepCount;
        // Update IndexedDB
        const db = indexedDB.open('step-counter', 1);
        db.onsuccess = (event) => {
            const db = event.target.result;
            const stepsStore = db.transaction('steps', 'readwrite').objectStore('steps');
            stepsStore.clear();
        };
    }
});

document.getElementById('set-daily-goal-button').addEventListener('click', () => {
    // Set daily goal
    dailyGoal = parseInt(document.getElementById('daily-goal-input').value);
    localStorage.setItem('dailyGoal', dailyGoal);
    document.getElementById('daily-goal').textContent = `Daily Goal: ${dailyGoal} steps`;
});

document.getElementById('create-challenge-button').addEventListener('click', () => {
    // Create challenge
    const challengeName = prompt('Enter challenge name:');
    if (challengeName !== null) {
        const challenge = { id: challengeList.length + 1, name: challengeName };
        challengeList.push(challenge);
        const db = indexedDB.open('step-counter', 1);
        db.onsuccess = (event) => {
            const db = event.target.result;
            const challengesStore = db.transaction('challenges', 'readwrite').objectStore('challenges');
            challengesStore.add(challenge);
        };
        const challengeListElement = document.getElementById('challenge-list');
        challengeListElement.innerHTML = '';
        challengeList.forEach((challenge) => {
            const challengeElement = document.createElement('li');
            challengeElement.textContent = challenge.name;
            challengeListElement.appendChild(challengeElement);
        });
    }
});

document.getElementById('get-recommendations-button').addEventListener('click', () => {
    // Get recommendations
    const recommendations = [
        { id: 1, name: 'Walk in the park' },
        { id: 2, name: 'Hike in the mountains' },
        { id: 3, name: 'Walk on the beach' }
    ];
    recommendationList = recommendations;
    const recommendationListElement = document.getElementById('recommendation-list');
    recommendationListElement.innerHTML = '';
    recommendations.forEach((recommendation) => {
        const recommendationElement = document.createElement('li');
        recommendationElement.textContent = recommendation.name;
        recommendationListElement.appendChild(recommendationElement);
    });
});

document.getElementById('view-rewards-button').addEventListener('click', () => {
    // View rewards
    const rewards = [
        { id: 1, name: 'Badge: 1000 steps' },
        { id: 2, name: 'Badge: 5000 steps' },
        { id: 3, name: 'Badge: 10000 steps' }
    ];
    const rewardsElement = document.getElementById('rewards');
    rewardsElement.innerHTML = '';
    rewards.forEach((reward) => {
        const rewardElement = document.createElement('li');
        rewardElement.textContent = reward.name;
        rewardsElement.appendChild(rewardElement);
    });
});

// Update caloric burn and distance tracked
setInterval(() => {
    caloricBurn += 0.1;
    distanceTracked += 0.1;
    document.getElementById('caloric-burn-count').textContent = `Caloric Burn: ${caloricBurn.toFixed(1)} kcal`;
    document.getElementById('distance-tracked-count').textContent = `Distance Tracked: ${distanceTracked.toFixed(1)} km`;
}, 1000);

// Update streak count
setInterval(() => {
    streakCount += 1;
    document.getElementById('streak-count').textContent = `Streak: ${streakCount} days`;
}, 86400000); // 24 hours
