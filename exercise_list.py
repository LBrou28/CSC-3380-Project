from api.models import BaseExercise
import subprocess
import json

"""
    Edit base exercise list here!
    Run 'python manage.py update_exercises' to save changes
"""
exercises = [
    # Chest
    { "name": "Push-Ups", "group": "CHEST", "video": "https://www.youtube.com/shorts/UIcct-7b6oE"},
    { "name": "Bench Press", "group": "CHEST", "video": "https://www.youtube.com/shorts/hWbUlkb5Ms4"},
    { "name": "Incline Chest Press", "group": "CHEST", "video": "https://www.youtube.com/shorts/98HWfiRonkE"},
    { "name": "DB Bench Press", "group": "CHEST", "video": "https://www.youtube.com/shorts/mTaiQemkEpU"},

    # Back
    { "name": "Pull-Ups", "group": "BACK", "video": "https://www.youtube.com/shorts/Lic9H2TUCxk"},
    { "name": "Barbell Rows", "group": "BACK", "video": "https://www.youtube.com/shorts/Nqh7q3zDCoQ"},
    { "name": "Cable Rows", "group": "BACK", "video": "https://www.youtube.com/shorts/qD1WZ5pSuvk"},
    { "name": "Lat PullDowns", "group": "BACK", "video": "https://www.youtube.com/shorts/hnSqbBk15tw"},
    

    # Legs
    { "name": "Bodyweight Squat", "group": "LEGS", "video": "https://www.youtube.com/watch?v=m0GcZ24pK6k"},
    { "name": "Goblet Squat", "group": "LEGS", "video": "https://www.youtube.com/shorts/lRYBbchqxtI"},
    { "name": "Quad Extensions", "group": "LEGS", "video": "https://www.youtube.com/shorts/ztNBgrGy6FQ"},
    { "name": "Hamstring Curls", "group": "LEGS", "video": "https://www.youtube.com/shorts/tnioxYoLdvw"},
    { "name": "Calf Raises", "group": "LEGS", "video": "https://www.youtube.com/shorts/baEXLy09Ncc"},
    { "name": "RDLS", "group": "LEGS", "video": "https://www.youtube.com/shorts/5rIqP63yWFg"},
    

    # Shoulders
    { "name": "Overhead Press", "group": "SHOULDERS", "video": "https://www.youtube.com/shorts/4LBVP2Oe7fg"},
    { "name": "Lateral Raise", "group": "SHOULDERS", "video": "https://www.youtube.com/shorts/Bcr6WBc2WKc"},
    { "name": "DB Shoulder Press", "group": "SHOULDERS", "video": "https://www.youtube.com/watch?v=qEwKCR5JCog"},
    { "name": "Rear Delt Flys", "group": "SHOULDERS", "video": "https://www.youtube.com/shorts/LsT-bR_zxLo"},
    

    # Arms
    { "name": "Bicep Curls", "group": "ARMS", "video": "https://www.youtube.com/shorts/PuaJzTatIJM"},
    { "name": "Triceps Dips", "group": "ARMS", "video": "https://www.youtube.com/shorts/dM400jrR8fw"},
    { "name": "Triceps Extensions", "group": "ARMS", "video": "https://www.youtube.com/shorts/AYqg9S5FrUU"},
    { "name": "Over-Head Tricep Extensions", "group": "ARMS", "video": "https://www.youtube.com/watch?v=5crTU1JiMfU"},
    { "name": "EZ Bar Bicep Curls", "group": "ARMS", "video": "https://www.youtube.com/shorts/d2r5TCqnR4Y"},
    { "name": "Incline Bicep Curls", "group": "ARMS", "video": "https://www.youtube.com/shorts/S2cYwsDhpI4"},
    { "name": "Spider Curls", "group": "ARMS", "video": "https://www.youtube.com/shorts/5OS4vb_JxsE"},

    # Core
    { "name": "Plank", "group": "CORE", "video": "https://www.youtube.com/shorts/hoeNgjheDHk"},
    { "name": "Russian Twist", "group": "CORE", "video": "https://www.youtube.com/watch?v=JyUqwkVpsi8"},
    { "name": "Sit-ups", "group": "CORE", "video": "https://www.youtube.com/watch?v=1fbU_MkV7NE"},
    { "name": "Leg Raises", "group": "CORE", "video": "https://www.youtube.com/shorts/fbGDQGHxvHk"},

    # Full Body
    { "name": "Burpees", "group": "FULLBODY", "video": "https://en.wikipedia.org/wiki/Burpee_(exercise)"},
    { "name": "Mountain Climbers", "group": "FULLBODY", "video": "https://www.youtube.com/shorts/hZb6jTbCLeE"},
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
                "description": "placeholder description",
                "video": exercise.get("video")
            }
        }
        converted_exercises.append(converted_exercise)

    with open("./api/fixtures/exercises.json", "w") as f:
        json_string = json.dumps(converted_exercises, indent=4)
        f.write(json_string)

    print("updated json!")