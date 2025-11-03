/*
	Exercises and stuff
*/

import {$, $$, shuffle, formatMMSS} from "/modules/utils.js"

const EXERCISES = [
	// Chest
	{ name: "Push-Ups", group: "Chest" },

	// Back
	{ name: "Pull-Ups", group: "Back" },

	// Legs
	{ name: "Bodyweight Squat", group: "Legs" },
	{ name: "Goblet Squat", group: "Legs" },

	// Shoulders
	{ name: "Overhead Press", group: "Shoulders" },
	{ name: "Lateral Raise", group: "Shoulders" },

	// Arms
	{ name: "Bicep Curls", group: "Arms" },
	{ name: "Triceps Dips", group: "Arms" },

	// Core
	{ name: "Plank", group: "Core" },
	{ name: "Russian Twist", group: "Core" },

	// Full Body
	{ name: "Burpees", group: "Full Body" },
	{ name: "Mountain Climbers", group: "Full Body" },
];

let currentWorkout = [];
const workoutOutput = document.querySelector("#workoutOutput");

class WorkoutOutput {
	constructor(workout, outputMessage) {
		this.workout = workout;
		this.outputMessage = outputMessage;
	}
}

function generateWorkout() {
    var workout = [];

    const selected = $$('input[name="group"]:checked').map((element) => element.value);
    const count = Math.max(0, parseInt($("#count").value));

	if (count <= 0) {
	    let outputMessage = `Exercise count must be atleast 1.`;
        workout = [];
        return new WorkoutOutput(workout, outputMessage);	
	}

    if (selected.length === 0) {
        let outputMessage = `Select at least one muscle group.`;
        workout = [];
        return new WorkoutOutput(workout, outputMessage);
    }

    const pool = EXERCISES.filter((exercise) => selected.includes(exercise.group));
    if (pool.length === 0) {
        let outputMessage = `No exercises match your selection.`;
        workout = [];
        return new WorkoutOutput(workout, outputMessage);
    }

    const picks = shuffle(pool).slice(0, Math.min(count, pool.length));
    workout = picks;

    return new WorkoutOutput(workout, null);
}

function renderWorkoutList(workoutList, outputMessage) {
    workoutOutput.innerHTML = "";
	
	const header = `
		<br>
		<strong>Your Workout: </strong><br>
		<label for="workoutNameBox">Name:</label>
		<input type="text" id="workoutNameBox" name="workoutNameBox" placeholder="type workout name here"><br>
	`
	workoutOutput.innerHTML += header;

    workoutList.forEach((workout, index) => {
        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `
            <div>
            <strong>${index + 1}. ${workout.name}</strong>
            <span>${workout.group}</span>
            </div>
            <div class="item-actions">
            <span>3 sets × 10 reps</span>
            <button class="btn" data-action="remove">Remove</button>
            </div>
        `;

        row.querySelector('[data-action="remove"]').addEventListener("click", () => {
            currentWorkout.splice(index, 1);
            renderWorkoutList(currentWorkout);
        });

        workoutOutput.appendChild(row);
    });

	workoutOutput.innerHTML += "<br>"

    if (workoutList.length === 0) {
        workoutOutput.innerHTML = `Workout cleared.`;
    }
    if (outputMessage != null) {
        workoutOutput.innerHTML = outputMessage;
    }
}

function setCurrentWorkout(workout, outputMessage) {
	currentWorkout = workout;
	renderWorkoutList(workout, outputMessage);
}

function getCurrentWorkout() { // Idk
	return currentWorkout;
}

export { EXERCISES, generateWorkout, setCurrentWorkout, getCurrentWorkout }