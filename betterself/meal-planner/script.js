// Initialize IndexedDB
const db = indexedDB.open('meal-planner', 1);
db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('recipes', { keyPath: 'id' });
    db.createObjectStore('meal-plans', { keyPath: 'id' });
};

// Initialize LocalStorage
const storage = window.localStorage;

const allergiesSelect = document.getElementById('allergies');

allergiesData.forEach(allergy => {
    const option = document.createElement('option');
    option.value = allergy;
    option.text = allergy;
    allergiesSelect.appendChild(option);
});

// Meal Planner Form Submission
document.getElementById('meal-planner-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const dietaryPreferences = document.getElementById('dietary-preferences').value;
    const allergiesSelect = document.getElementById('allergies');
    const allergies = Array.from(allergiesSelect.selectedOptions)
        .map(option => option.value);
    const goals = document.getElementById('goals').value;
    const cookingTime = document.getElementById('cooking-time').value;
    generateMealPlan(dietaryPreferences, allergies, goals, cookingTime);
});

function generateMealPlan(dietaryPreferences, allergies, goals, cookingTime) {
    // Simulate AI-powered meal recommendation logic
    const mealPlan = [];

    // Filter recipes based on dietary preferences and allergies
    const filteredRecipes = recipes.filter(recipe => {
        return recipe.dietaryRestrictions.includes(dietaryPreferences) &&
            !recipe.cautions.some(allergy => allergies.includes(allergy)) &&
            recipe.cookingTime <= cookingTime;
    });

    if (filteredRecipes.length === 0) {
        displayMessage("No recipes found that match your criteria.");
        return;
    }

    // Prioritize recipes based on goals
    filteredRecipes.sort((a, b) => {
        if (goals === 'weight-loss') {
            return a.calories - b.calories;
        } else if (goals === 'muscle-gain') {
            return b.protein - a.protein;
        } else {
            return 0;
        }
    });

    function displayMessage(message) {
        // Display the message to the user, e.g., using an alert or a specific DOM element
        alert(message);
    }

    // Select top 5 recipes
    for (let i = 0; i < 5; i++) {
        mealPlan.push(filteredRecipes[i]);
    }

    displayMealPlan(mealPlan);
}

// Display Meal Plan (continued)
function displayMealPlan(mealPlan) {
    const mealPlanResults = document.getElementById('meal-plan-results');
    mealPlanResults.innerHTML = '';
    mealPlan.forEach((recipe) => {
        const recipeHTML = `
            <h3>${recipe.name}</h3>
            <ul>
                ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
            </ul>
        `;
        mealPlanResults.insertAdjacentHTML('beforeend', recipeHTML);
    });
}

// Grocery List Generation
function generateGroceryList(mealPlan) {
    const groceryList = [];
    mealPlan.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            if (!groceryList.includes(ingredient)) {
                groceryList.push(ingredient);
            }
        });
    });
    displayGroceryList(groceryList);
}

// Display Grocery List
function displayGroceryList(groceryList) {
    const groceryListItems = document.getElementById('grocery-list-items');
    groceryListItems.innerHTML = '';
    groceryList.forEach((ingredient) => {
        const ingredientHTML = `<li>${ingredient}</li>`;
        groceryListItems.insertAdjacentHTML('beforeend', ingredientHTML);
    });
}

// Recipe Import Form Submission
document.getElementById('recipe-import-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const recipeUrl = document.getElementById('recipe-url').value;
    importRecipe(recipeUrl);
});

// Import Recipe
function importRecipe(recipeUrl) {
    // TO DO: Implement recipe import and analysis
    const recipe = {
        id: 1,
        name: 'Imported Recipe',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
    };
    displayImportedRecipe(recipe);
}

// Display Imported Recipe
function displayImportedRecipe(recipe) {
    const recipeImportResults = document.getElementById('recipe-import-results');
    recipeImportResults.innerHTML = '';
    const recipeHTML = `
        <h3>${recipe.name}</h3>
        <ul>
            ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
        </ul>
    `;
    recipeImportResults.insertAdjacentHTML('beforeend', recipeHTML);
}

// LocalStorage and IndexedDB interaction
function saveMealPlan(mealPlan) {
    storage.setItem('mealPlan', JSON.stringify(mealPlan));
    const db = indexedDB.open('meal-planner', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const mealPlansStore = db.transaction('meal-plans', 'readwrite').objectStore('meal-plans');
        mealPlansStore.add(mealPlan);
    };
}

function loadMealPlan() {
    const mealPlan = storage.getItem('mealPlan');
    if (mealPlan) {
        return JSON.parse(mealPlan);
    } else {
        return [];
    }
}

function saveRecipe(recipe) {
    const db = indexedDB.open('meal-planner', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const recipesStore = db.transaction('recipes', 'readwrite').objectStore('recipes');
        recipesStore.add(recipe);
    };
}

function loadRecipes() {
    const db = indexedDB.open('meal-planner', 1);
    db.onsuccess = (event) => {
        const db = event.target.result;
        const recipesStore = db.transaction('recipes', 'readonly').objectStore('recipes');
        const recipes = [];
        recipesStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                recipes.push(cursor.value);
                cursor.continue();
            } else {
                return recipes;
            }
        };
    };
}
