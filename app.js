/*
	The app, currently only generates workouts
*/

import { EXERCISES, generateWorkout } from "/modules/exercises.js"

// exercise generator
const generateBtn = document.querySelector("#generateBtn");
const workoutOutput = document.querySelector("#workoutOutput");
const saveFavoriteBtn = document.querySelector("#saveFavoriteBtn");
const clearWorkoutBtn = document.querySelector("#clearWorkoutBtn");

let currentWorkout = [];

function renderWorkoutList(workoutList, outputMessage) {
    workoutOutput.innerHTML = "";
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

    if (workoutList.length === 0) {
        workoutOutput.innerHTML = `Workout cleared.`;
    }
    if (outputMessage != null) {
        workoutOutput.innerHTML = outputMessage;
    }
}

generateBtn.addEventListener("click", function() {
    let output = generateWorkout();
    let outputMessage = output.outputMessage
    currentWorkout = output.workout;

    renderWorkoutList(currentWorkout, outputMessage);
});

clearWorkoutBtn.addEventListener("click", () => {
    currentWorkout = [];
    renderWorkoutList(currentWorkout);
});
