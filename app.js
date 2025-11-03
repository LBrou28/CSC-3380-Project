/*
	The app, currently only generates workouts
*/

import { EXERCISES, Workout, generateWorkout, setCurrentWorkout } from "/modules/exercises.js"
import * as stopwatch from "/modules/stopwatch.js"
import * as dataManager from "/modules/dataManager.js"

// exercise generator
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

// stopwatch
stopwatch.init();

// data
dataManager.init();