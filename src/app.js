/*
	The app, currently only generates workouts AND More
*/
import * as workout_generator from "/modules/features/workout_generator.js"
import * as stopwatch from "/modules/features/stopwatch.js"
import * as saved_workouts from "/modules/features/saved_workouts.js"
import * as notes from "/modules/features/notes.js"
import * as weekly_planner from "/modules/features/weekly_planner.js"

workout_generator.init()
stopwatch.init()
saved_workouts.init()
notes.init()
weekly_planner.init()
