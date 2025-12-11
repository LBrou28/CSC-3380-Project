from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.contrib.auth.models import User
from api.views import initialize_user

class Command(BaseCommand):
    def handle(self, *args, **options):
        for user in User.objects.all():
            initialize_user(user)