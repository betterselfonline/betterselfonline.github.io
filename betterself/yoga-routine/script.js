// Initialize IndexedDB
const db = indexedDB.open('yoga-routines', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('routines', { keyPath: 'id' });
    db.createObjectStore('poses', { keyPath: 'id' });
    db.createObjectStore('community', { keyPath: 'id' });
};

// Initialize LocalStorage
const storage = window.localStorage;

// Load data from IndexedDB
db.onsuccess = (event) => {
    const db = event.target.result;
    const routinesStore = db.transaction('routines').objectStore('routines');
    const posesStore = db.transaction('poses').objectStore('poses');
    const communityStore = db.transaction('community').objectStore('community');

    // Load routines
    routinesStore.getAll().onsuccess = (event) => {
        const routines = event.target.result;
        const routineList = document.getElementById('routine-list');
        routines.forEach((routine) => {
            const routineItem = document.createElement('li');
            routineItem.textContent = routine.name;
            routineList.appendChild(routineItem);
        });
    };

    // Load poses
    posesStore.getAll().onsuccess = (event) => {
        const poses = event.target.result;
        const poseList = document.getElementById('pose-list');
        poses.forEach((pose) => {
            const poseItem = document.createElement('li');
            poseItem.textContent = pose.name;
            poseList.appendChild(poseItem);
        });
    };

    // Load community
    communityStore.getAll().onsuccess = (event) => {
        const community = event.target.result;
        const communityList = document.getElementById('community-list');
        community.forEach((member) => {
            const memberItem = document.createElement('li');
            memberItem.textContent = member.name;
            communityList.appendChild(memberItem);
        });
    };
};

// Handle form submission
document.getElementById('custom-routine-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const routineName = document.getElementById('routine-name').value;
    const poseSelect = document.getElementById('pose-select');
    const poseIds = Array.from(poseSelect.selectedOptions).map((option) => option.value);
    const duration = document.getElementById('duration').value;

    // Create new routine
    const newRoutine = {
        id: Date.now(),
        name: routineName,
        poses: poseIds,
        duration: duration,
    };

    // Add routine to IndexedDB
    const db = indexedDB.open('yoga-routines', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const routinesStore = db.transaction('routines', 'readwrite').objectStore('routines');
        routinesStore.add(newRoutine);
    };

    // Update LocalStorage
    storage.setItem('custom-routine', JSON.stringify(newRoutine));
});

// Handle pose selection
document.getElementById('pose-select').addEventListener('change', (event) => {
    const poseIds = Array.from(event.target.selectedOptions).map((option) => option.value);
    const poseList = document.getElementById('pose-list');
    poseList.innerHTML = '';
    poseIds.forEach((poseId) => {
        const pose = getPose(poseId);
        const poseItem = document.createElement('li');
        poseItem.textContent = pose.name;
        poseList.appendChild(poseItem);
    });
});

// Handle community selection
document.getElementById('community-list').addEventListener('click', (event) => {
    const memberId = event.target.dataset.memberId;
    const member = getMember(memberId);
    const communityList = document.getElementById('community-list');
    communityList.innerHTML = '';
    communityList.appendChild(createMemberItem(member));
});

// Helper functions
function getPose(poseId) {
    const db = indexedDB.open('yoga-routines', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const posesStore = db.transaction('poses').objectStore('poses');
        return posesStore.get(poseId);
    };
}

function getMember(memberId) {
    const db = indexedDB.open('yoga-routines', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const communityStore = db.transaction('community').objectStore('community');
        return communityStore.get(memberId);
    };
}

function createMemberItem(member) {
    const memberItem = document.createElement('li');
    memberItem.textContent = member.name;
    memberItem.dataset.memberId = member.id;
    return memberItem;
}

// Initialize data
const routines = [
    { id: 1, name: 'Morning Flow', poses: [1, 2, 3], duration: 30 },
    { id: 2, name: 'Evening Relaxation', poses: [4, 5, 6], duration: 20 },
];

const poses = [
    { id: 1, name: 'Downward-Facing Dog', description: '...' },
    { id: 2, name: 'Warrior II', description: '...' },
    { id: 3, name: 'Triangle Pose', description: '...' },
    { id: 4, name: 'Seated Forward Fold', description: '...' },
    { id: 5, name: 'Plank Pose', description: '...' },
    { id: 6, name: 'Tree Pose', description: '...' },
];

const community = [
    { id: 1, name: 'John Doe', bio: '...' },
    { id: 2, name: 'Jane Doe', bio: '...' },
];

// Add data to IndexedDB
const db = indexedDB.open('yoga-routines', 1);
db.onsuccess = (event) => {
    const db = event.target.result;
    const routinesStore = db.transaction('routines', 'readwrite').objectStore('routines');
    const posesStore = db.transaction('poses', 'readwrite').objectStore('poses');
    const communityStore = db.transaction('community', 'readwrite').objectStore('community');

    routines.forEach((routine) => {
        routinesStore.add(routine);
    });

    poses.forEach((pose) => {
        posesStore.add(pose);
    });

    community.forEach((member) => {
        communityStore.add(member);
    });
};
