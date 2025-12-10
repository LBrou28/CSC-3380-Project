from django.shortcuts import render, redirect
from rest_framework.authtoken.models import Token
import json

# Create your views here.
def app_view(request):
    if not request.user.is_authenticated:
        return redirect("/accounts/login/")

    user_data = {
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email
    }

    token, _ = Token.objects.get_or_create(user=request.user)

    return render(request, "app/index.html", {"user": json.dumps(user_data), "api_url": request.build_absolute_uri("/api"), "auth_token": token.key})