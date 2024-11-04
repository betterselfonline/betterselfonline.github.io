// Checklist for Healthy Sleep Habits
const checklistItems = [
    { id: 1, text: "Establish a consistent sleep schedule" },
    { id: 2, text: "Create a relaxing bedtime routine" },
    { id: 3, text: "Avoid caffeine and electronics before bedtime" },
    // ...
];

const checklistList = document.getElementById("checklist-items");
checklistItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item.text;
    checklistList.appendChild(listItem);
});

// Sleep Environment Assessment
const environmentForm = document.getElementById("environment-form");
const environmentQuestions = [
    { id: 1, text: "Is your bedroom quiet?" },
    { id: 2, text: "Is your bedroom dark?" },
    { id: 3, text: "Is your bedroom cool?" },
    // ...
];

environmentQuestions.forEach((question) => {
    const questionElement = document.createElement("div");
    questionElement.textContent = question.text;
    const inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    questionElement.appendChild(inputElement);
    environmentForm.appendChild(questionElement);
});

// Sleep Goal Tracker
const trackerForm = document.getElementById("tracker-form");
const trackerFields = [
    { id: 1, text: "Sleep goal (hours)" },
    { id: 2, text: "Wake-up time" },
    // ...
];

trackerFields.forEach((field) => {
    const fieldElement = document.createElement("div");
    fieldElement.textContent = field.text;
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    fieldElement.appendChild(inputElement);
    trackerForm.appendChild(fieldElement);
});

// Sleep Quality Analytics
const analyticsChart = document.getElementById("analytics-chart");
const analyticsData = [
    { date: "2023-02-01", quality: 80 },
    { date: "2023-02-02", quality: 70 },
    { date: "2023-02-03", quality: 90 },
    // ...
];

const chart = new Chart(analyticsChart, {
    type: "line",
    data: {
        labels: analyticsData.map((data) => data.date),
        datasets: [{
            label: "Sleep Quality",
            data: analyticsData.map((data) => data.quality),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
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

// Personalized Sleep Recommendations
const recommendationsList = document.getElementById("recommendations-list");
const recommendations = [
    { id: 1, text: "Establish a consistent sleep schedule" },
    { id: 2, text: "Create a relaxing bedtime routine" },
    { id: 3, text: "Avoid caffeine and electronics before bedtime" },
    // ...
];

recommendations.forEach((recommendation) => {
    const listItem = document.createElement("li");
    listItem.textContent = recommendation.text;
    recommendationsList.appendChild(listItem);
});

// LocalStorage for user preferences storage
const userPreferences = {
    // ...
};

localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

// IndexedDB for user-generated data storage
const db = indexedDB.open("sleepHygieneDB", 1);

db.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore("sleepData", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("date", "date", { unique: false });
    objectStore.createIndex("quality", "quality", { unique: false });
};

db.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["sleepData"], "readwrite");
    const objectStore = transaction.objectStore("sleepData");

    // Add data to the object store
    const sleepData = [
        { date: "2023-02-01", quality: 80 },
        { date: "2023-02-02", quality: 70 },
        { date: "2023-02-03", quality: 90 },
        // ...
    ];

    sleepData.forEach((data) => {
        const request = objectStore.add(data);
        request.onsuccess = () => {
            console.log("Data added to the object store");
        };
    });
};

db.onerror = (event) => {
    console.log("Error opening the database");
};

// Get data from the object store
const getData = () => {
    const db = indexedDB.open("sleepHygieneDB", 1);
    const transaction = db.transaction(["sleepData"], "readonly");
    const objectStore = transaction.objectStore("sleepData");
    const request = objectStore.getAll();

    request.onsuccess = () => {
        const data = request.result;
        console.log(data);
    };
};

// Update data in the object store
const updateData = (id, data) => {
    const db = indexedDB.open("sleepHygieneDB", 1);
    const transaction = db.transaction(["sleepData"], "readwrite");
    const objectStore = transaction.objectStore("sleepData");
    const request = objectStore.get(id);

    request.onsuccess = () => {
        const oldData = request.result;
        const newData = { ...oldData, ...data };
        const updateRequest = objectStore.put(newData);

        updateRequest.onsuccess = () => {
            console.log("Data updated in the object store");
        };
    };
};

// Delete data from the object store
const deleteData = (id) => {
    const db = indexedDB.open("sleepHygieneDB", 1);
    const transaction = db.transaction(["sleepData"], "readwrite");
    const objectStore = transaction.objectStore("sleepData");
    const request = objectStore.delete(id);

    request.onsuccess = () => {
        console.log("Data deleted from the object store");
    };
};

// Check if the user is online or offline
const isOnline = () => {
    return navigator.onLine;
};

// Handle online/offline events
window.addEventListener("online", () => {
    console.log("User is online");
    // Sync data with the server
});

window.addEventListener("offline", () => {
    console.log("User is offline");
    // Store data locally
});

// Register the service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then((registration) => {
            console.log("Service worker registered");
        })
        .catch((error) => {
            console.log("Error registering service worker");
        });
}
