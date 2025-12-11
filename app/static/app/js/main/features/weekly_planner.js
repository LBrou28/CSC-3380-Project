/*
    Weekly Planner - Assign saved workouts to specific days of the week
*/

import { $, call_api } from "/static/app/js/main/utils.js"

const PLANNER_KEY = "flexforge_weekly_planner_v1";
const DAYS_OF_WEEK = {
    "MON": "Monday",
    "TUE": "Tuesday",
    "WED": "Wednesday",
    "THU": "Thursday",
    "FRI": "Friday",
    "SAT": "Saturday",
    "SUN": "Sunday"
};

async function rerender() {
    const plannerOutput = $("#weeklyPlannerOutput");
    if (!plannerOutput) return;

    const planner_days = await call_api("planner", "GET")
    
    plannerOutput.innerHTML = "";
    
    planner_days.forEach((planner_day) => {
        const display_day_string = DAYS_OF_WEEK[planner_day.day]

        const dayContainer = document.createElement("div");
        dayContainer.className = "day-container";
        
        const dayName = document.createElement("h4");
        dayName.textContent = display_day_string;
        dayContainer.appendChild(dayName);
        
        const workoutDisplay = document.createElement("div");
        workoutDisplay.className = "workout-display";
        
        const workout = planner_day.workout
        if (workout) {
            const exercisesText = workout.exercises
                .map(exercise => exercise.base_exercise.name)
                .join(", ");
            
            workoutDisplay.innerHTML = `
                <strong>${workout.name}</strong>
                <p>${exercisesText}</p>
            `;
        } else {
            workoutDisplay.innerHTML = `<p class="muted">Rest day or unassigned</p>`;
        }
        
        dayContainer.appendChild(workoutDisplay);
        
        // Assign/Remove buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "day-actions";
        
        const assignBtn = document.createElement("button");
        assignBtn.className = "btn";
        assignBtn.textContent = "Assign";
        assignBtn.addEventListener("click", () => {
            showAssignDialog(planner_day.day);
        });
        buttonContainer.appendChild(assignBtn);
        
        const removeBtn = document.createElement("button");
        removeBtn.className = "btn ghost";
        removeBtn.textContent = "Clear";
        removeBtn.addEventListener("click", async () => {
            await call_api("planner", "PATCH", {day: planner_day.day, workout_id: null})
            rerender()
        });
        buttonContainer.appendChild(removeBtn);
        
        dayContainer.appendChild(buttonContainer);
        plannerOutput.appendChild(dayContainer);
    });
}

async function showAssignDialog(day) {
    let savedWorkouts = [];
    
    const unfiltered_saved_workouts = await call_api("saved_workouts", "GET")
    unfiltered_saved_workouts.forEach((workout) => {
        if (!workout.currently_editing) {
            savedWorkouts.push(workout)
        }
    })
    
    if (savedWorkouts.length === 0) {
        alert("No saved workouts available. Please save a workout first.");
        return;
    }
    
    // Create a simple selection interface
    let options = savedWorkouts
        .map((workout, i) => `${i + 1}. ${workout.name}`)
        .join("\n");
    
    let message = `Select a workout for ${DAYS_OF_WEEK[day]}:\n\n${options}\n\nEnter the number (or 0 to cancel):`;
    let choice = prompt(message, "");
    
    if (choice === null || choice === "") return;
    
    let index = parseInt(choice) - 1;
    if (index >= 0 && index < savedWorkouts.length) {
        var selectedWorkout = savedWorkouts[index];

        await call_api("planner", "PATCH", {day: day, workout_id: selectedWorkout.id})
        rerender()
    } else if (choice !== "0") {
        alert("Invalid selection");
    }
}

async function clearPlan() {
    for (let day in DAYS_OF_WEEK) {
        // Awesome 7 Api calls
        await call_api("planner", "PATCH", {day: day, workout_id: null})
    }

    rerender()
}

function exportPlanAsText() {
    let exportText = "WEEKLY WORKOUT PLAN\n";
    exportText += "===================\n\n";
    
    DAYS_OF_WEEK.forEach(day => {
        exportText += `${day}:\n`;
        if (weeklyPlan[day]) {
            const workout = weeklyPlan[day];
            exportText += `  Workout: ${workout.name}\n`;
            exportText += `  Exercises:\n`;
            workout.exercises.forEach(ex => {
                exportText += `    - ${ex.name} (${ex.group})\n`;
            });
        } else {
            exportText += `  Rest day\n`;
        }
        exportText += "\n";
    });
    
    return exportText;
}

function exportPlanAsJSON() {
    return JSON.stringify(weeklyPlan, null, 2);
}

export function downloadPlanAsText() {
    const text = exportPlanAsText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flexforge-weekly-plan-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

export function downloadPlanAsJSON() {
    const json = exportPlanAsJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flexforge-weekly-plan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function init() {
    rerender()
    
    const downloadTxtBtn = $("#downloadPlanText");
    const downloadJsonBtn = $("#downloadPlanJSON");
    const clearPlanBtn = $("#clearWeeklyPlan");
    
    if (downloadTxtBtn) {
        downloadTxtBtn.addEventListener("click", downloadPlanAsText);
    }
    
    if (downloadJsonBtn) {
        downloadJsonBtn.addEventListener("click", downloadPlanAsJSON);
    }
    
    if (clearPlanBtn) {
        clearPlanBtn.addEventListener("click", async () => {
            clearPlan()
        });
    }
}
