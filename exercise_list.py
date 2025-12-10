from api.models import BaseExercise
import subprocess
import json

"""
    Edit base exercise list here!
    Run 'python manage.py update_exercises' to save changes
"""
exercises = [
    # Chest
    { "name": "Push-Ups", "group": "CHEST" },
    { "name": "Bench Press", "group": "CHEST" },
    { "name": "Incline Chest Press", "group": "CHEST" },
    { "name": "DB Bench Press", "group": "CHEST" },

    # Back
    { "name": "Pull-Ups", "group": "BACK" },
    { "name": "Barbell Rows", "group": "BACK" },
    { "name": "Cable Rows", "group": "BACK" },
    { "name": "Lat PullDowns", "group": "BACK" },
    

    # Legs
    { "name": "Bodyweight Squat", "group": "LEGS" },
    { "name": "Goblet Squat", "group": "LEGS" },
    { "name": "Quad Extensions", "group": "LEGS" },
    { "name": "Hamstring Curls", "group": "LEGS" },
    { "name": "Calf Raises", "group": "LEGS" },
    { "name": "RDLS", "group": "LEGS" },
    

    # Shoulders
    { "name": "Overhead Press", "group": "SHOULDERS" },
    { "name": "Lateral Raise", "group": "SHOULDERS" },
    { "name": "DB Shoulder Press", "group": "SHOULDERS" },
    { "name": "Rear Delt Flys", "group": "SHOULDERS" },
    

    # Arms
    { "name": "Bicep Curls", "group": "ARMS" },
    { "name": "Triceps Dips", "group": "ARMS" },
    { "name": "Triceps Extensions", "group": "ARMS" },
    { "name": "Over-Head Tricep Extensions", "group": "ARMS" },
    { "name": "EZ Bar Bicep Curls", "group": "ARMS" },
    { "name": "Incline Bicep Curls", "group": "ARMS" },
    { "name": "Spider Curls", "group": "ARMS" },

    # Core
    { "name": "Plank", "group": "CORE" },
    { "name": "Russian Twist", "group": "CORE" },
    { "name": "Sit-ups", "group": "CORE" },
    { "name": "Leg Raises", "group": "CORE" },

    # Full Body
    { "name": "Burpees", "group": "FULLBODY" },
    { "name": "Mountain Climbers", "group": "FULLBODY" },
]

def update():
    converted_exercises = []

    for index, exercise in enumerate(exercises):
        converted_exercise = {
            "model": "api.BaseExercise",
            "pk": index + 1,
            "fields": {
                "name": exercise.get("name"),
                "muscle_group": exercise.get("group"),
                "description": "placeholder description"
            }
        }
        converted_exercises.append(converted_exercise)

    with open("./api/fixtures/exercises.json", "w") as f:
        json_string = json.dumps(converted_exercises, indent=4)
        f.write(json_string)

    print("updated json!")