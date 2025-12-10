from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from api.models import BaseExercise
import subprocess
import exercise_list

class Command(BaseCommand):
    def handle(self, *args, **options):
        exercise_list.update()
        BaseExercise.objects.all().delete()
        call_command("loaddata", "exercises.json")
        print("Updated base exercises!")