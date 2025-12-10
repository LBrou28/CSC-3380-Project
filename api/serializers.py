from rest_framework import serializers
from .models import Planner, PlannerDay, BaseExercise, Exercise, Workout

class BaseExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseExercise
        fields = ['id', 'name', 'description', 'muscle_group']

class ExerciseSerializer(serializers.ModelSerializer):
    base_exercise = BaseExerciseSerializer()

    class Meta:
        model = Exercise
        fields = ['sets', 'reps', 'base_exercise']

class WorkoutSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True)

    class Meta:
        model = Workout
        fields = ['name', 'exercises', 'currently_editing']

class GenerateWorkoutSerializer(serializers.Serializer):
    muscle_groups = serializers.ListField(
        child=serializers.ChoiceField(list(BaseExercise.MUSCLE_GROUPS.values())),
        min_length=1
    )
    count = serializers.IntegerField(min_value=1, max_value=6)

class WorkoutIdSerializer(serializers.Serializer):
    workout_id = serializers.IntegerField(min_value=0)

class AddExerciseSerializer(serializers.Serializer):
    workout_id = serializers.IntegerField(min_value=0)
    base_exercise_id = serializers.IntegerField(min_value=0)
    reps = serializers.IntegerField(min_value=1, default=10, required=False)
    sets = serializers.IntegerField(min_value=1, default=3, required=False)

class RemoveExerciseSerializer(serializers.Serializer):
    exercise_id = serializers.IntegerField(min_value=0)

class UpdateWorkoutSerializer(serializers.Serializer):
    workout_id = serializers.IntegerField(min_value=0)
    name = serializers.CharField(max_length=500, required=False)

class UpdateExerciseSerializer(serializers.Serializer):
    exercise_id = serializers.IntegerField(min_value=0)
    reps = serializers.IntegerField(min_value=1, required=False)
    sets = serializers.IntegerField(min_value=1, required=False)

class SetPlannerSerializer(serializers.Serializer):
    day = serializers.ChoiceField(list(PlannerDay.DAYS_OF_THE_WEEK.values()))
    workout_id = serializers.IntegerField(min_value=0, allow_null=True)

class PlannerDaySerializer(serializers.ModelSerializer):
    workout = WorkoutSerializer(allow_null=True, required=False)

    class Meta:
        model = PlannerDay
        fields = ['workout', 'day']

class PlannerSerializer(serializers.ModelSerializer):
    planner_days = PlannerDaySerializer(many=True)

    class Meta:
        model = Planner
        fields = ['planner_days']