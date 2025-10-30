import { EXERCISES } from "/modules/exercises.js"

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function formatMMSS(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

const generateBtn = document.querySelector("#generateBtn");
const workoutOutput = document.querySelector("#workoutOutput");
const saveFavoriteBtn = document.querySelector("#saveFavoriteBtn");
const clearWorkoutBtn = document.querySelector("#clearWorkoutBtn");

let currentWorkout = [];

function generateWorkout() {
    var workout = [];

    const selected = $$('input[name="group"]:checked').map((element) => element.value);
    const count = Math.max(1, Math.min(12, parseInt($("#count").value || "6", 10)));

    if (selected.length === 0) {
        workoutOutput.innerHTML = `Select at least one muscle group.`;
        workout = [];
        return;
    }

    const pool = EXERCISES.filter((exercise) => selected.includes(exercise.group));
    if (pool.length === 0) {
        workoutOutput.innerHTML = `No exercises match your selection.`;
        workout = [];
        return;
    }

    const picks = shuffle([...pool]).slice(0, Math.min(count, pool.length));
    workout = picks;

    return workout;
}

function renderWorkoutList(workoutList) {
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
}

generateBtn.addEventListener("click", function() {
    currentWorkout = generateWorkout();
    renderWorkoutList(currentWorkout);
});

clearWorkoutBtn.addEventListener("click", () => {
    currentWorkout = [];
    renderWorkoutList(currentWorkout);
});