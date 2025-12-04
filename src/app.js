/*
	The app, currently only generates workouts AND More
*/
import * as workout_generator from "/src/features/workout_generator.js"
import * as stopwatch from "/src/features/stopwatch.js"
import * as saved_workouts from "/src/features/saved_workouts.js"
import * as notes from "/src/features/notes.js"

workout_generator.init()
stopwatch.init()
saved_workouts.init()
notes.init()