// Get references to HTML elements
const dailyPromptElement = document.getElementById('daily-prompt');
const completeChallengeButton = document.getElementById('complete-challenge');
const reflectionInputElement = document.getElementById('reflection-input');
const submitReflectionButton = document.getElementById('submit-reflection');
const videoTipElement = document.getElementById('video-tip');
const badgeListElement = document.getElementById('badge-list');
const sharingInputElement = document.getElementById('sharing-input');
const shareProgressButton = document.getElementById('share-progress');

// Initialize LocalStorage and IndexedDB
const localStorage = window.localStorage;
const indexedDB = window.indexedDB;

// Define constants
const DAILY_CHALLENGE_PROMPTS = [
    'Eat slowly and savor your food',
    'Pay attention to your hunger and fullness cues',
    'Eat without distractions',
    'Try a new food',
    'Drink water before meals'
];

const WEEKLY_REFLECTION_PROMPTS = [
    'What did you learn about yourself this week?',
    'What challenges did you face?',
    'What successes did you experience?'
];

const VIDEO_TIPS = [
    { id: 1, title: 'Mindful Eating 101', src: 'video-tip-1.mp4' },
    { id: 2, title: 'Overcoming Emotional Eating', src: 'video-tip-2.mp4' }
];

const BADGES = [
    { id: 1, title: 'Newbie', description: 'Complete 1 day of challenges', image: 'badge-1.png' },
    { id: 2, title: 'Rookie', description: 'Complete 3 days of challenges', image: 'badge-2.png' },
    { id: 3, title: 'Pro', description: 'Complete 7 days of challenges', image: 'badge-3.png' }
];

// Define functions
function getDailyChallengePrompt() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return DAILY_CHALLENGE_PROMPTS[dayOfWeek];
}

function getWeeklyReflectionPrompt() {
    const today = new Date();
    const weekOfYear = today.getWeek();
    return WEEKLY_REFLECTION_PROMPTS[weekOfYear % WEEKLY_REFLECTION_PROMPTS.length];
}

function getVideoTip() {
    const randomIndex = Math.floor(Math.random() * VIDEO_TIPS.length);
    return VIDEO_TIPS[randomIndex];
}

function getBadge() {
    const streak = getStreak();
    if (streak >= 7) {
        return BADGES[2];
    } else if (streak >= 3) {
        return BADGES[1];
    } else {
        return BADGES[0];
    }
}

function getStreak() {
    const storedStreak = localStorage.getItem('streak');
    if (storedStreak) {
        return parseInt(storedStreak);
    } else {
        return 0;
    }
}

function incrementStreak() {
    const streak = getStreak();
    localStorage.setItem('streak', streak + 1);
}

function storeReflection(reflection) {
    const db = indexedDB.open('mindful-eating', 1);
    db.onsuccess = function (event) {
        const db = event.target.result;
        const tx = db.transaction('reflections', 'readwrite');
        const store = tx.objectStore('reflections');
        store.add({ reflection: reflection, date: new Date() });
    };
}

function storeSharing(sharing) {
    const db = indexedDB.open('mindful-eating', 1);
    db.onsuccess = function (event) {
        const db = event.target.result;
        const tx = db.transaction('sharings', 'readwrite');
        const store = tx.objectStore('sharings');
        store.add({ sharing: sharing, date: new Date() });
    };
}

// Initialize app
function init() {
    dailyPromptElement.textContent = getDailyChallengePrompt();
    reflectionInputElement.placeholder = getWeeklyReflectionPrompt();
    videoTipElement.src = getVideoTip().src;
    badgeListElement.innerHTML = '';
    const badge = getBadge();
    const badgeListItem = document.createElement('li');
    badgeListItem.innerHTML = `<img src="${badge.image}" alt="${badge.title}"> ${badge.title}`;
    badgeListElement.appendChild(badgeListItem);
}

// Event listeners
completeChallengeButton.addEventListener('click', function () {
    incrementStreak();
    init();
});

submitReflectionButton.addEventListener('click', function () {
    const reflection = reflectionInputElement.value;
    storeReflection(reflection);
    reflectionInputElement.value = '';
});

shareProgressButton.addEventListener('click', function () {
    const sharing = sharingInputElement.value;
    storeSharing(sharing);
    sharingInputElement.value = '';
});

// Initialize IndexedDB
indexedDB.open('mindful-eating', 1, function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('reflections')) {
        db.createObjectStore('reflections', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('sharings')) {
        db.createObjectStore('sharings', { keyPath: 'id', autoIncrement: true });
    }
});

// Initialize app
init();
