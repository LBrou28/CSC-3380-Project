/*
    handles saving workouts, rendering, and selecting
*/

import {$, $$, shuffle, formatMMSS} from "/static/app/js/main/utils.js"
import {Workout} from "/static/app/js/main/core/classes.js"
import * as workout_generator from "/static/app/js/main/features/workout_generator.js"

var savedWorkouts = []
const savedWorkoutsOutput = $("#savedWorkoutsOutput")
const saveFavoriteBtn = document.querySelector("#saveFavoriteBtn");

function renderData(savedWorkoutsToRender) {
    savedWorkoutsOutput.innerHTML = "";

    savedWorkoutsToRender.forEach((savedWorkout, index) => {
		var exercisesText = "";
		savedWorkout.exercises.forEach((exercise, index) => {
			exercisesText += exercise.name
			if (index < savedWorkout.exercises.length - 1) {
				exercisesText += ", ";
			}
		})

        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `
            <div>
            <strong>${index + 1}) ${savedWorkout.name}</strong>
            <p>${exercisesText}<p>
            </div>
            <div class="item-actions">
			<button class="btn" data-action="load">Load</button>
            <button class="btn" data-action="remove">Remove</button>
            </div><br>
        `;

        row.querySelector('[data-action="remove"]').addEventListener("click", () => {
            savedWorkouts.splice(index, 1);
            renderData(savedWorkouts);
        });

		row.querySelector('[data-action="load"]').addEventListener("click", () => {
			workout_generator.setCurrentWorkout(savedWorkout);
        });

        savedWorkoutsOutput.appendChild(row);
    });

    if (savedWorkoutsToRender.length === 0) {
        savedWorkoutsOutput.innerHTML = `None`;
    }
}

function loadWorkout(workout) {
	workout_generator.setCurrentWorkout(workout);
}

function saveWorkout(workout) {
	if (workout.length <= 0) {
		alert("You can only save non-empty workouts")
		return
	}
	savedWorkouts.push(workout);	
	renderData(savedWorkouts);
	save();
}

function save() {
	let data = JSON.stringify(savedWorkouts);
	localStorage.setItem("savedWorkouts", data);
}

function load() {
	let data = localStorage.getItem("savedWorkouts")
	if (data == null) {
		data = [];
	} else {
		data = JSON.parse(data);
	}
	savedWorkouts = data;
	renderData(data);
}

export function init() {
	load();

	saveFavoriteBtn.addEventListener("click", function() {
		var input = document.querySelector("#workoutNameBox")
		let workoutName = input.value.trim();
		var workout = new Workout(workout_generator.getCurrentWorkout().exercises, workoutName)
		saveWorkout(workout);
	})
}