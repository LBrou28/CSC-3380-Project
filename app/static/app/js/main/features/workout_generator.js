/*
    Handles workout generation and rendering the workout generator
*/
import {$, $$, call_api, shuffle, formatMMSS} from "/static/app/js/main/utils.js"
import {Workout, WorkoutOutput} from "/static/app/js/main/core/classes.js"
import {EXERCISES} from "/static/app/js/main/core/exercises_list.js"

let currentWorkout = null;
const workoutOutput = document.querySelector("#workoutOutput");

async function generateWorkout() {
    const muscle_groups = $$('input[name="group"]:checked').map((element) => element.value);
    const count = Math.max(0, parseInt($("#count").value));

    const response = await call_api("generate_workout", "POST", { muscle_groups: muscle_groups, count: count })
    rerender()
}

async function clearWorkouts() {
    const saved_workouts = await call_api("saved_workouts", "GET")
    var generated_id;
    saved_workouts.forEach((workout) => {
        if (workout.currently_editing == true) {
            generated_id = workout.id
        }
    })

    if (generated_id) {
        const response = await call_api("delete_workout", "DELETE", { workout_id: generated_id })
        rerender()
    }
}

function createWorkoutCard(workout) {
    workoutOutput.innerHTML = "";
	
	const header = document.createElement("div");
	header.innerHTML = `
		<div>
		<br>
		<strong>Your Workout: </strong><br>
		<label for="workoutNameBox">Name:</label>
		<input type="text" id="workoutNameBox" name="workoutNameBox" placeholder="type workout name here" value="${workout.name}"><br>
		</div>
	`
	workoutOutput.appendChild(header);

    workout.exercises.forEach((exercise, index) => {
        const base_exercise = exercise.base_exercise

        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `
            <div>
            <strong>${index + 1}. ${base_exercise.name}</strong>
            <span>${base_exercise.muscle_group}</span>
            </div>
            <div class="item-actions">
            <span>${exercise.sets} sets × ${exercise.reps} reps</span>
            <button class="btn" data-action="remove">Remove</button>
            </div>
        `;
        
        var button = row.querySelector('[data-action="remove"]')
        button.addEventListener("click", async () => {
            console.log("CLICK!!")

            const response = await call_api("edit_workout_exercises", "DELETE", { exercise_id: exercise.id })
            rerender()
        });

        workoutOutput.appendChild(row);
    });

	workoutOutput.appendChild(document.createElement("br"))
}

/*
    Includes generated workout
*/
export async function rerender() {
    const saved_workouts = await call_api("saved_workouts", "GET")
    var generator_workout;

    saved_workouts.forEach((workout) => {
        if (workout.currently_editing == true) {
            // Generator Workout
            generator_workout = workout
        }
    })

    if (generator_workout) {
        createWorkoutCard(generator_workout)
    } else {
        workoutOutput.innerHTML = ""
    }
}

export function init() {
    const generateBtn = document.querySelector("#generateBtn");
    const clearWorkoutBtn = document.querySelector("#clearWorkoutBtn");

    rerender()

    generateBtn.addEventListener("click", async function() {
        generateWorkout()
    });

    clearWorkoutBtn.addEventListener("click", async () => {
        clearWorkouts()
    });
}