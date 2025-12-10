from django.shortcuts import render, redirect
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

    return render(request, "app/index.html", {"user": json.dumps(user_data)})