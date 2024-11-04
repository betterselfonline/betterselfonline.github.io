const recipes = [
    {
        "id": 1,
        "name": "Quick Chicken Alfredo",
        "description": "Creamy Alfredo sauce with grilled chicken and fettuccine pasta.",
        "yield": 2,
        "dietLabels": [
            "High-Protein"
        ],
        "healthLabels": [
            "Peanut-Free",
            "Tree-Nut-Free"
        ],
        "cautions": [
            "Dairy",
            "Gluten"
        ],
        "cookingTime": 25,
        "totalTime": 30,
        "prepTime": 5,
        "calories": 600,
        "protein": 32,
        "carbohydrates": 45,
        "fat": 30,
        "dietaryRestrictions": [
            "gluten"
        ],
        "cuisine": "Italian",
        "mealType": "Dinner",
        "dishType": "Main course",
        "costPerMeal": 7.5,
        "equipment": [
            "large pot",
            "skillet",
            "spatula",
            "measuring cups"
        ],
        "ingredients": [
            {
                "item": "fettuccine",
                "quantity": 200,
                "measure": "grams",
                "substitutes": [
                    "spaghetti",
                    "gluten-free pasta"
                ]
            },
            {
                "item": "chicken breast",
                "quantity": 200,
                "measure": "grams",
                "substitutes": [
                    "tofu",
                    "turkey breast"
                ]
            },
            {
                "item": "heavy cream",
                "quantity": 0.5,
                "measure": "cup",
                "substitutes": [
                    "coconut cream",
                    "cashew cream"
                ]
            },
            {
                "item": "grated Parmesan",
                "quantity": 0.25,
                "measure": "cup",
                "substitutes": [
                    "nutritional yeast",
                    "pecorino"
                ]
            },
            {
                "item": "olive oil",
                "quantity": 1,
                "measure": "tablespoon",
                "substitutes": [
                    "avocado oil",
                    "butter"
                ]
            },
            {
                "item": "Salt and pepper",
                "quantity": "to taste",
                "measure": "",
                "substitutes": []
            }
        ],
        "instructions": [
            "Cook the fettuccine according to package instructions.",
            "In a skillet, heat olive oil and cook the chicken until golden.",
            "Add cream, Parmesan, salt, and pepper. Simmer for 5 minutes.",
            "Toss pasta with the sauce and serve."
        ]
    },
    {
        "id": 2,
        "name": "Spicy Beef Tacos",
        "description": "Flavorful beef tacos with spicy seasoning, fresh cilantro, and lime.",
        "yield": 4,
        "dietLabels": [
            "Low-Carb"
        ],
        "healthLabels": [
            "Gluten-Free"
        ],
        "cautions": [],
        "cookingTime": 20,
        "totalTime": 20,
        "prepTime": 0,
        "calories": 450,
        "protein": 28,
        "carbohydrates": 35,
        "fat": 20,
        "dietaryRestrictions": [],
        "cuisine": "Mexican",
        "mealType": "Lunch",
        "dishType": "Main course",
        "costPerMeal": 5.0,
        "equipment": [
            "skillet",
            "measuring spoons",
            "spatula"
        ],
        "ingredients": [
            {
                "item": "ground beef",
                "quantity": 200,
                "measure": "grams",
                "substitutes": [
                    "ground turkey",
                    "black beans"
                ]
            },
            {
                "item": "taco seasoning",
                "quantity": 1,
                "measure": "tablespoon",
                "substitutes": [
                    "homemade taco seasoning mix",
                    "cajun seasoning"
                ]
            },
            {
                "item": "corn tortillas",
                "quantity": 4,
                "measure": "pieces",
                "substitutes": [
                    "flour tortillas",
                    "lettuce wraps"
                ]
            },
            {
                "item": "chopped cilantro",
                "quantity": 0.25,
                "measure": "cup",
                "substitutes": [
                    "parsley",
                    "green onions"
                ]
            },
            {
                "item": "diced onions",
                "quantity": 0.25,
                "measure": "cup",
                "substitutes": [
                    "green onions",
                    "shallots"
                ]
            },
            {
                "item": "lime wedges",
                "quantity": 2,
                "measure": "wedges",
                "substitutes": [
                    "lemon wedges"
                ]
            }
        ],
        "instructions": [
            "In a skillet, cook the beef until browned. Add taco seasoning and stir.",
            "Warm the tortillas in a separate pan.",
            "Assemble tacos with beef, cilantro, onions, and a squeeze of lime."
        ]
    },
    {
        "id": 3,
        "name": "Vegetable Stir-Fry with Chicken",
        "description": "Quick and healthy stir-fried chicken with colorful vegetables.",
        "yield": 2,
        "dietLabels": [
            "Low-Calorie"
        ],
        "healthLabels": [
            "Dairy-Free",
            "Gluten-Free"
        ],
        "cautions": [],
        "cookingTime": 15,
        "totalTime": 15,
        "prepTime": 0,
        "calories": 320,
        "protein": 27,
        "carbohydrates": 20,
        "fat": 10,
        "dietaryRestrictions": [
            "gluten-free"
        ],
        "cuisine": "Chinese",
        "mealType": "Dinner",
        "dishType": "Main course",
        "costPerMeal": 6.0,
        "equipment": [
            "skillet",
            "spatula",
            "measuring spoons"
        ],
        "ingredients": [
            {
                "item": "chicken breast",
                "quantity": 150,
                "measure": "grams",
                "substitutes": [
                    "shrimp",
                    "tofu"
                ]
            },
            {
                "item": "broccoli florets",
                "quantity": 0.5,
                "measure": "cup",
                "substitutes": [
                    "green beans",
                    "asparagus"
                ]
            },
            {
                "item": "sliced bell peppers",
                "quantity": 0.5,
                "measure": "cup",
                "substitutes": [
                    "zucchini",
                    "carrots"
                ]
            },
            {
                "item": "sliced carrots",
                "quantity": 0.25,
                "measure": "cup",
                "substitutes": [
                    "zucchini",
                    "snap peas"
                ]
            },
            {
                "item": "soy sauce",
                "quantity": 1,
                "measure": "tablespoon",
                "substitutes": [
                    "tamari",
                    "coconut aminos"
                ]
            },
            {
                "item": "olive oil",
                "quantity": 1,
                "measure": "tablespoon",
                "substitutes": [
                    "sesame oil",
                    "canola oil"
                ]
            }
        ],
        "instructions": [
            "Heat oil in a skillet and cook chicken until golden.",
            "Add vegetables and stir-fry for 5-7 minutes.",
            "Add soy sauce and stir. Serve hot."
        ]
    },
    {
        "id": 4,
        "name": "Classic Avocado Toast with Egg",
        "description": "Creamy avocado spread on toast topped with a sunny-side-up egg.",
        "yield": 1,
        "dietLabels": [
            "Vegetarian"
        ],
        "healthLabels": [
            "Peanut-Free",
            "Tree-Nut-Free"
        ],
        "cautions": [
            "Eggs"
        ],
        "cookingTime": 10,
        "totalTime": 10,
        "prepTime": 0,
        "calories": 350,
        "protein": 12,
        "carbohydrates": 24,
        "fat": 22,
        "dietaryRestrictions": [
            "vegetarian"
        ],
        "cuisine": "American",
        "mealType": "Breakfast",
        "dishType": "Snack",
        "costPerMeal": 2.5,
        "equipment": [
            "toaster",
            "pan",
            "spatula"
        ],
        "ingredients": [
            {
                "item": "whole-grain bread",
                "quantity": 1,
                "measure": "slice",
                "substitutes": [
                    "gluten-free bread",
                    "rye bread"
                ]
            },
            {
                "item": "avocado",
                "quantity": 0.5,
                "measure": "piece",
                "substitutes": [
                    "mashed peas",
                    "hummus"
                ]
            },
            {
                "item": "egg",
                "quantity": 1,
                "measure": "piece",
                "substitutes": [
                    "tofu scramble",
                    "chia seeds (for vegan)"
                ]
            },
            {
                "item": "Salt and pepper",
                "quantity": "to taste",
                "measure": "",
                "substitutes": []
            },
            {
                "item": "Red pepper flakes",
                "quantity": "optional",
                "measure": "",
                "substitutes": [
                    "paprika",
                    "black pepper"
                ]
            }
        ],
        "instructions": [
            "Toast the bread until golden brown.",
            "Mash the avocado and spread it on the toast.",
            "In a pan, cook the egg sunny-side up.",
            "Top the avocado toast with the egg, salt, pepper, and red pepper flakes."
        ]
    }
]