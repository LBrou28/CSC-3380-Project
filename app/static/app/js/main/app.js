/*
	The app, currently only generates workouts AND More
*/
import * as workout_generator from "/static/app/js/main/features/workout_generator.js"
import * as stopwatch from "/static/app/js/main/features/stopwatch.js"
import * as saved_workouts from "/static/app/js/main/features/saved_workouts.js"
import * as notes from "/static/app/js/main/features/notes.js"
import * as weekly_planner from "/static/app/js/main/features/weekly_planner.js"

workout_generator.init()
stopwatch.init()
saved_workouts.init()
notes.init()
weekly_planner.init()
