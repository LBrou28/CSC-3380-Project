/*
    Handles workout generation and rendering the workout generator
*/

import {$, $$, shuffle, formatMMSS} from "/src/utils.js"
import {Workout, WorkoutOutput} from "/src/core/classes.js"
import {EXERCISES} from "/src/core/exercises_list.js"

let currentWorkout = null;
const workoutOutput = document.querySelector("#workoutOutput");

function generateWorkout() {
    var exercises = [];

    const selected = $$('input[name="group"]:checked').map((element) => element.value);
    const count = Math.max(0, parseInt($("#count").value));

	if (count <= 0) {
	    let outputMessage = `Exercise count must be atleast 1.`;
        exercises = [];
        return new WorkoutOutput(new Workout(exercises, "Workout"), outputMessage);	
	}

    if (selected.length === 0) {
        let outputMessage = `Select at least one muscle group.`;
        exercises = [];
        return new WorkoutOutput(new Workout(exercises, "Workout"), outputMessage);
    }

    const pool = EXERCISES.filter((exercise) => selected.includes(exercise.group));
    if (pool.length === 0) {
        let outputMessage = `No exercises match your selection.`;
        exercises = [];
        return new WorkoutOutput(new Workout(exercises, "Workout"), outputMessage);
    }

    const picks = shuffle(pool).slice(0, Math.min(count, pool.length));
    exercises = picks;

    return new WorkoutOutput(new Workout(exercises, "New Workout"), null);
}

function renderWorkout(workout, outputMessage) {
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
        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `
            <div>
            <strong>${index + 1}. ${exercise.name}</strong>
            <span>${exercise.group}</span>
            </div>
            <div class="item-actions">
            <span>3 sets × 10 reps</span>
            <button class="btn" data-action="remove">Remove</button>
            </div>
        `;

        row.querySelector('[data-action="remove"]').addEventListener("click", () => {
            currentWorkout.splice(index, 1);
            renderWorkout(currentWorkout);
        });

        workoutOutput.appendChild(row);
    });

	workoutOutput.innerHTML += "<br>"

    if (workout.exercises.length === 0) {
        workoutOutput.innerHTML = `Workout cleared.`;
    }
    if (outputMessage != null) {
        workoutOutput.innerHTML = outputMessage;
    }
}

export function setCurrentWorkout(workout, outputMessage) {
	currentWorkout = workout;
	renderWorkout(workout, outputMessage);
}

export function getCurrentWorkout() { // Idk
	return currentWorkout;
}

export function init() {
    const generateBtn = document.querySelector("#generateBtn");
    const clearWorkoutBtn = document.querySelector("#clearWorkoutBtn");

    generateBtn.addEventListener("click", function() {
        let output = generateWorkout();
        let outputMessage = output.outputMessage
        setCurrentWorkout(output.workout, outputMessage)
    });

    clearWorkoutBtn.addEventListener("click", () => {
        setCurrentWorkout(new Workout([], "Workout"));
    });
}