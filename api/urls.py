from django.urls import path
from . import views

urlpatterns = [
    path('saved_workouts', views.SavedWorkoutsList.as_view(), name="saved_workouts"),
    path('generate_workout', views.GenerateWorkout.as_view(), name="generate_workout"),
    path('save_current_workout', views.SaveCurrentWorkout.as_view(), name="save_current_workout"),
    path('load_workout', views.LoadWorkout.as_view(), name="load_workout"),
    path('delete_workout', views.DeleteWorkout.as_view(), name='delete_workout'),
    path('edit_workout', views.WorkoutEdit.as_view(), name='edit_workout'),
    path('edit_workout_exercises', views.WorkoutExercisesEdit.as_view(), name='edit_workout_exercises'),
    path('get_base_exercises', views.BaseExercisesList.as_view(), name='get_base_exercises'),
    path('planner', views.PlannerView.as_view(), name='planner')
]