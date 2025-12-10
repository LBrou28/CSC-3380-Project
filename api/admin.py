from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.BaseExercise)
admin.site.register(models.Exercise)
admin.site.register(models.Workout)
admin.site.register(models.Planner)
admin.site.register(models.PlannerDay)