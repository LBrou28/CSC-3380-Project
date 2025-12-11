# CSC-3380-Project Group 21

# "FlexForge"

## Members:
Luke Broussard, Phong Huong, Michael Brennan, Alex Nguyen, Gabriel Kominas

## Description:
Our website, FlexForge, is a workout tool that streamlines the process of finding a workout regiment. FlexForge generates workouts for the user based on the target muscle groups that the user selects.

## How to run:

#### Step 1: Clone the repository
```
git clone https://github.com/LBrou28/CSC-3380-Project
cd CSC-3380-Project
```

#### Step 2: Initialize the Python virtual environment
```
python -m venv .venv
.venv/Scripts/activate.ps1 # if on powershell
.venv/Scripts/activate.bat # if on terminal
```

#### Step 3: Download dependencies
```
pip install -r requirements.txt
```

#### Step 4: Initialize database
```
python manage.py migrate
python manage.py update_exercises
```

#### Step 5: Start the server
```
python manage.py runserver
```

The project should then be accessible at `localhost:8000/`