from django.shortcuts import render
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import *
from .serializers import *
from random import choice
from collections import deque
import random

# Create your views here.
class BaseExercisesList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
            GET api/saved_workouts
            Gets the complete list of base exercises in the form of:
            [
                {
                    "id": id of the base exercise
                    "name": the name
                    "description": description of the base exercise, currently placeholder
                    "muscle_group": muscle group of the base exercise
                }
                ...
            ]
        """
        base_exercises = BaseExercise.objects.all()
        serializer = BaseExerciseSerializer(base_exercises, many=True)
        return Response(serializer.data)

class SavedWorkoutsList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
            GET api/get_base_exercises
            Gets a list of saved workouts in the form of:
            [
                {
                    "name": workout name
                    "currently_editing": is the workout being edited? (in the generator area)
                    "exercises": [
                        {
                            "sets": amount of sets for the exercise
                            "reps": amount of reps for the exercise
                            "base_exercise": {
                                "id": id of the base exercise
                                "name": the name
                                "description": description of the base exercise, currently placeholder
                                "muscle_group": muscle group of the base exercise
                            }
                        }
                        ...
                    ]
                }
                ...
            ]
        """
        workouts = Workout.objects.filter(user=request.user)
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data)

class GenerateWorkout(APIView):
    permission_classes = [IsAuthenticated]

    def generate_workout(self, request, serializer):
        muscle_groups = serializer.validated_data.get("muscle_groups")
        count = serializer.validated_data.get("count")

        # Select muscle groups somewhat randomly like Tetris bag system
        group_queue = deque()

        def repopulate():
            clone = list(muscle_groups)
            
            for i in range(len(clone)):
                selection = random.choice(clone)
                group_queue.append(selection)
                clone.remove(selection)

        def pop():
            result = group_queue.popleft()
            
            if len(group_queue) <= 0:
                repopulate()

            return result

        repopulate()

        workout = Workout.objects.create(user=request.user, name="Workout", currently_editing=True)

        selected_exercise_ids = []

        index = count
        consecutive_skips = 0
        while index > 0: 
            muscle_group = pop()
            exercises = BaseExercise.objects.filter(muscle_group=muscle_group).exclude(id__in=selected_exercise_ids)

            if not exercises.exists():
                consecutive_skips += 1
                if consecutive_skips >= 10:
                    break

                continue

            selected = random.choice(list(exercises))
            selected_exercise_ids.append(selected.id)

            Exercise.objects.create(base_exercise=selected, workout=workout, sets=10, reps=3)

            consecutive_skips = 0
            index -= 1

        return workout

    def post(self, request, format=None):
        """
            POST api/generate_workout
            {
                "muscle_groups": List of muscle groups to choose from
                "count": amount of exercises to generate (between 1-6)
            }
        """
        serializer = GenerateWorkoutSerializer(data=request.data)
        if serializer.is_valid():
            # Delete old generated workouts
            old_workouts = Workout.objects.filter(user=request.user, currently_editing=True)
            for old_workout in old_workouts:
                old_workout.delete()

            # Generate a new workout
            workout = self.generate_workout(request, serializer)
            workout_serializer = WorkoutSerializer(workout)

            return Response(workout_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SaveCurrentWorkout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        """ 
            POST api/save_current_workout
            {
                name: name of the workout
            }
        """
        serializer = SaveCurrentWorkoutSerializer(data=request.data)

        if serializer.is_valid():
            try:
                current_workout = Workout.objects.get(user=request.user, currently_editing=True)
            except Workout.DoesNotExist:
                return Response({"detail": "No current workout"}, status.HTTP_400_BAD_REQUEST)

            cloned_workout = Workout.objects.create(user=request.user, name=current_workout.name, currently_editing=False)
            for exercise in current_workout.exercises.all():
                Exercise.objects.create(base_exercise=exercise.base_exercise, workout=cloned_workout, sets=exercise.sets, reps=exercise.reps)

            name = serializer.validated_data.get("name")
            if name is not None:
                cloned_workout.name = name
                cloned_workout.save()
            
            workout_serializer = WorkoutSerializer(cloned_workout)
            return Response(workout_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoadWorkout(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        """
            POST api/load_workout
            {
                "workout_id": Id of the workout to load
            }
        """
        serializer = WorkoutIdSerializer(data=request.data)

        if serializer.is_valid():
            # get workout to load
            try:
                workout = Workout.objects.get(user=request.user, id=serializer.validated_data.get("workout_id"))
            except Workout.DoesNotExist:
                return Response({"detail": "Could not get workout"}, status=status.HTTP_404_NOT_FOUND)

            # delete old workout
            try:
                current_workout = Workout.objects.get(user=request.user, currently_editing=True)
                current_workout.delete()
            except Workout.DoesNotExist:
                pass

            # clone the loaded workout
            cloned_workout = Workout.objects.create(user=request.user, name=workout.name, currently_editing=True)
            for exercise in workout.exercises.all():
                Exercise.objects.create(base_exercise=exercise.base_exercise, workout=cloned_workout, sets=exercise.sets, reps=exercise.reps)

            serializer = WorkoutSerializer(cloned_workout)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteWorkout(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        """
            DELETE api/delete_workout
            {
                "workout_id": Id of the workout to delete
            }
        """
        serializer = WorkoutIdSerializer(data=request.data)

        if serializer.is_valid():
            # get workout to delete
            try:
                workout = Workout.objects.get(user=request.user, id=serializer.validated_data.get("workout_id"))
                workout.delete()
            except Workout.DoesNotExist:
                return Response({"detail": "Could not find workout to delete"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"detail": "Successfully deleted workout"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WorkoutExercisesEdit(APIView):
    permission_classes = [IsAuthenticated]

    # Add exercise to workout
    def post(self, request, format=None):
        """
            POST api/edit_workout_exercises
            {
                "workout_id": Id of the workout to add to
                "base_exercise_id": Id of the base exercise 
                "sets": amount of sets
                "reps": amount of reps
            }
        """
        serializer = AddExerciseSerializer(data=request.data)

        if serializer.is_valid():
            workout_id = serializer.validated_data.get("workout_id")
            base_exercise_id = serializer.validated_data.get("workout_id")
            sets = serializer.validated_data.get("sets")
            reps = serializer.validated_data.get("reps")

            # get workout to modify
            try:
                workout = Workout.objects.get(user=request.user, id=workout_id)
            except Workout.DoesNotExist:
                return Response({"detail": "Could not find workout to modify"}, status=status.HTTP_404_NOT_FOUND)

            # get base exercise
            try:
                base_exercise = BaseExercise.objects.get(id=base_exercise_id)
            except Workout.DoesNotExist:
                return Response({"detail": "Could not find workout to modify"}, status=status.HTTP_404_NOT_FOUND)

            exercise = Exercise.objects.create(base_exercise=base_exercise, workout=workout, sets=sets, reps=reps)
            return Response(ExerciseSerializer(exercise).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        """
            DELETE api/edit_workout_exercises
            {
                "exercise_id": Id of the exercise to delete
            }
        """
        serializer = RemoveExerciseSerializer(data=request.data)

        if serializer.is_valid():
            exercise_id = serializer.validated_data.get("exercise_id")

            # get exercise to delete
            try:
                exercise = Exercise.objects.get(workout__user=request.user, id=exercise_id)
                exercise.delete()
            except Exercise.DoesNotExist:
                return Response({"detail": "Could not find exercise to delete"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"detail": "Exercise deleted!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, format=None):
        """
            PATCH api/edit_workout_exercises
            {
                "exercise_id": Id of the exercise to patch
                "reps": New amount of reps
                "sets": New amount of sets
            }
        """
        serializer = UpdateExerciseSerializer(data=request.data)

        if serializer.is_valid():
            exercise_id = serializer.validated_data.get("exercise_id")
            reps = serializer.validated_data.get("reps")
            sets = serializer.validated_data.get("sets")

            # get exercise to patch
            try:
                exercise = Exercise.objects.get(workout__user=request.user, id=exercise_id)
            except Exercise.DoesNotExist:
                return Response({"detail": "Could not find exercise to patch"}, status=status.HTTP_404_NOT_FOUND)

            # patch
            if reps is not None:
                exercise.reps = reps

            if sets is not None:
                exercise.sets = sets

            exercise.save()

            return Response(ExerciseSerializer(exercise).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WorkoutEdit(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, format=None):
        """
            PATCH api/edit_workout
            {
                "workout_id": Id of the workout to patch
                "name": New name of the workoot
            }
        """
        serializer = UpdateWorkoutSerializer(data=request.data)

        if serializer.is_valid():
            workout_id = serializer.validated_data.get("workout_id")
            name = serializer.validated_data.get("name")
            
            # get workout to patch
            try:
                workout = Workout.objects.get(user=request.user, id=workout_id)
            except Workout.DoesNotExist:
                return Response({"detail": "Could not find workout to patch"}, status=status.HTTP_404_NOT_FOUND)

            if name is not None:
                workout.name = name

            workout.save()
            return Response(WorkoutSerializer(workout).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)\

def initialize_user(user):
    if not hasattr(user, 'planner'):
        planner = Planner.objects.create(user=user)
        for day_key, day_name in PlannerDay.DAYS_OF_THE_WEEK.items():
            PlannerDay.objects.create(planner=planner, day=day_name)

@receiver(post_save, sender=User)
def create_user_data(sender, instance, created, **kwargs):
    if created:
        initialize_user(instance)

class PlannerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
            GET api/planner
            Gets planner data in the form of
            [
                {
                    "day": "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
                    "workout": Workout Object (see SavedWorkoutsList for an example of an object)
                }
            ]
        """
        planner_days = PlannerDay.objects.filter(planner__user=request.user)
        serializer = PlannerDaySerializer(planner_days, many=True)
        return Response(serializer.data)

    def put(self, request, format=None):
        """
            PUT api/planner
            {
                "day": the day you want to edit
                "workout_id": the id of the workout to set to
            }
        """
        serializer = SetPlannerSerializer(data=request.data)

        if serializer.is_valid():
            workout_id = serializer.validated_data.get("workout_id")
            day = serializer.validated_data.get("day")

            # get workout
            workout = None
            if workout_id is not None:
                try:
                    workout = Workout.objects.get(user=request.user, id=workout_id)
                except Workout.DoesNotExist:
                    return Response({"detail": "Could not find workout"}, status=status.HTTP_404_NOT_FOUND)
            
            planner_day = PlannerDay.objects.get(planner__user=request.user, day=day)
            planner_day.workout = workout
            planner_day.save()
            
            return Response(PlannerDaySerializer(planner_day).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)