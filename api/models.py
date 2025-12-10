from django.db import models
from django.contrib.auth.models import User

# Workouts

# Will be binded to a user
class Workout(models.Model):
    name = models.CharField(max_length=500, default="New Workout")
    user = models.ForeignKey(User, related_name="workouts", on_delete=models.CASCADE)
    currently_editing = models.BooleanField(default=False)

# Exercises will be binded to this
class BaseExercise(models.Model):
    MUSCLE_GROUPS = {
        "1": "CHEST",
        "2": "BACK",
        "3": "LEGS",
        "4": "SHOULDERS",
        "5": "ARMS",
        "6": "CORE",
        "7": "FULLBODY"
    }

    name = models.CharField(max_length=500)
    muscle_group = models.CharField(max_length=200, choices=MUSCLE_GROUPS, default="CHEST")
    description = models.TextField()

    def __str__(self):
        return self.name

    class Meta():
        ordering = ['id']

# Will be binded to a workout and a BaseExercise
class Exercise(models.Model):
    base_exercise = models.ForeignKey(BaseExercise, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, related_name="exercises", on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()

# Planner stuff
class Planner(models.Model):
    user = models.OneToOneField(User, related_name="planner", on_delete=models.CASCADE)

class PlannerDay(models.Model):
    DAYS_OF_THE_WEEK = {
        "1": "MON",
        "2": "TUE",
        "3": "WED",
        "4": "THU",
        "5": "FRI",
        "6": "SAT",
        "7": "SUN"
    }
    day = models.CharField(max_length=20, choices=DAYS_OF_THE_WEEK, default="MON")
    planner = models.ForeignKey(Planner, related_name="planner_days", on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, related_name="planner_days", on_delete=models.SET_NULL, blank=True, null=True)