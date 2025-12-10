/*
    handles saving workouts, rendering, and selecting
*/

import {$, $$, call_api, shuffle, formatMMSS} from "/static/app/js/main/utils.js"
import * as workout_generator from "/static/app/js/main/features/workout_generator.js"

var savedWorkouts = []
const savedWorkoutsOutput = $("#savedWorkoutsOutput")
const saveFavoriteBtn = document.querySelector("#saveFavoriteBtn");

async function rerender() {
	const saved_workouts = await call_api("saved_workouts", "GET")
	
    savedWorkoutsOutput.innerHTML = "";

	var processed = 0
	saved_workouts.forEach((workout) => {
		if (workout.currently_editing == true) {
			return
		}

		var exercisesText = "";
		workout.exercises.forEach((exercise, index) => {
			const base_exercise = exercise.base_exercise
			exercisesText += base_exercise.name
			if (index < workout.exercises.length - 1) {
				exercisesText += ", ";
			}
		})

        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `
            <div>
            <strong>${processed + 1}) ${workout.name}</strong>
            <p>${exercisesText}<p>
            </div>
            <div class="item-actions">
			<button class="btn" data-action="load">Load</button>
            <button class="btn" data-action="remove">Remove</button>
            </div><br>
        `;

		row.querySelector('[data-action="remove"]').addEventListener("click", async () => {
			await call_api("delete_workout", "DELETE", { workout_id: workout.id })
			rerender()
        });

		row.querySelector('[data-action="load"]').addEventListener("click", async () => {
			await call_api("load_workout", "POST", { workout_id: workout.id })
			rerender()
			workout_generator.rerender()
			alert("Loaded workout!", "");
        });

		savedWorkoutsOutput.appendChild(row);
		
		processed += 1
    });

    if (processed === 0) {
        savedWorkoutsOutput.innerHTML = `None`;
    }
}

async function save_current_workout() {
	var input = document.querySelector("#workoutNameBox")

	if (!input) {
		return;
	}

	let workoutName = input.value.trim();
	
	const response = await call_api("save_current_workout", "POST", {name: workoutName})
	rerender()

    alert("Saved workout!", "");
}

export function init() {
	rerender()

	saveFavoriteBtn.addEventListener("click", async function () {
		save_current_workout()
	})
}