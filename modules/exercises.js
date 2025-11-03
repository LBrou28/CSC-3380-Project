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

let currentWorkout = null;
const workoutOutput = document.querySelector("#workoutOutput");

class WorkoutOutput {
	constructor(workout, outputMessage) {
		this.workout = workout;
		this.outputMessage = outputMessage;
	}
}

class Workout {
	constructor(exercises, name) {
		this.exercises = exercises;
		this.name = name;
	}
}

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

    return new WorkoutOutput(new Workout(exercises, "Workout"), null);
}

function renderWorkout(workout, outputMessage) {
    workoutOutput.innerHTML = "";
	
	const header = `
		<br>
		<strong>Your Workout: </strong><br>
		<label for="workoutNameBox">Name:</label>
		<input type="text" id="workoutNameBox" name="workoutNameBox" placeholder="type workout name here" value=${workout.name}><br>
	`
	workoutOutput.innerHTML += header;

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

function setCurrentWorkout(workout, outputMessage) {
	currentWorkout = workout;
	renderWorkout(workout, outputMessage);
}

function getCurrentWorkout() { // Idk
	return currentWorkout;
}

export { EXERCISES, Workout, generateWorkout, setCurrentWorkout, getCurrentWorkout }