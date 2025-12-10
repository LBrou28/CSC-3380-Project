/*
	Front end stuff for the main app
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

const user_json = JSON.parse(document.getElementById("user").textContent)
const user_object = JSON.parse(user_json)
console.log(user_object)

var welcome_header = document.getElementById("welcome-header")
welcome_header.innerText = "Hello, " + user_object.username + ", welcome to:"