from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from django.core.management import call_command
from django.contrib.auth.models import User
from rest_framework import status
from .views import *
import json

# Create your tests here.

class WorkoutAPITestCase(TestCase):
    def setUpTestData():
        call_command("update_exercises")    

    def setUp(self):
        self.test_user = User.objects.create(
            username="bill",
            password="bobby"
        )
        self.factory = APIRequestFactory()

    def call_api(self, method, url, viewClass, content=None):
        request = self.factory.get(url, content, format="json")

        if method == "post":
            request = self.factory.post(url, content, format="json")
        elif method =="delete":
            request = self.factory.delete(url, content, format="json")
        elif method == "put":
            request = self.factory.put(url, content, format="json")
        elif method == "patch":
            request = self.factory.patch(url, content, format="json")

        force_authenticate(request, self.test_user)
        view = viewClass.as_view()
        return view(request)

    def test_get_saved_workouts_new_user(self):
        response = self.call_api("get", "/api/saved_workouts", SavedWorkoutsList)
        self.assertEqual(response.data, [])

    def test_example_user(self):
        """
            Test what an average user would do
        """

        # Load saved workouts
        response = self.call_api("get", "/api/saved_workouts", SavedWorkoutsList)
        self.assertEqual(response.data, [])

        # Generate a workout
        response = self.call_api("post", "/api/generate_workout", GenerateWorkout, content={"muscle_groups": ["CHEST", "LEGS"], "count": 6})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["exercises"]), 6)
        
        # Load saved workouts again
        response = self.call_api("get", "/api/saved_workouts", SavedWorkoutsList)
        self.assertEqual(len(response.data[0]["exercises"]), 6)

        # Save the generated workout
        response = self.call_api("post", "/api/save_current_workout", SaveCurrentWorkout, content={"name": "billy's workout"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.call_api("get", "/api/saved_workouts", SavedWorkoutsList)
        self.assertEqual(len(response.data), 2)

        # Save it to planner
        response = self.call_api("patch", "/api/planner", PlannerView, content={"day": "TUE", "workout_id": 1})
        response = self.call_api("get", "/api/planner", PlannerView)
        tuesday = response.data[1]
        self.assertEqual(tuesday['workout']['name'], "Workout")

        # Delete the workout
        response = self.call_api("delete", "/api/delete_workout", DeleteWorkout, content={"workout_id": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.call_api("get", "/api/planner", PlannerView)
        tuesday = response.data[1]
        self.assertEqual(tuesday['workout'], None)

        response = self.call_api("get", "/api/saved_workouts", SavedWorkoutsList)
        self.assertEqual(len(response.data), 1)

