/*
    Weekly Planner - Assign saved workouts to specific days of the week
*/

import { $ } from "/modules/utils.js"

const PLANNER_KEY = "flexforge_weekly_planner_v1";
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

let weeklyPlan = {};

function initializePlan() {
    DAYS_OF_WEEK.forEach(day => {
        if (!weeklyPlan[day]) {
            weeklyPlan[day] = null;
        }
    });
}

function renderPlanner() {
    const plannerOutput = $("#weeklyPlannerOutput");
    if (!plannerOutput) return;
    
    plannerOutput.innerHTML = "";
    
    DAYS_OF_WEEK.forEach(day => {
        const dayContainer = document.createElement("div");
        dayContainer.className = "day-container";
        
        const dayName = document.createElement("h4");
        dayName.textContent = day;
        dayContainer.appendChild(dayName);
        
        const workoutDisplay = document.createElement("div");
        workoutDisplay.className = "workout-display";
        
        if (weeklyPlan[day]) {
            const workout = weeklyPlan[day];
            const exercisesText = workout.exercises
                .map(ex => ex.name)
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
            showAssignDialog(day);
        });
        buttonContainer.appendChild(assignBtn);
        
        const removeBtn = document.createElement("button");
        removeBtn.className = "btn ghost";
        removeBtn.textContent = "Clear";
        removeBtn.addEventListener("click", () => {
            weeklyPlan[day] = null;
            renderPlanner();
            savePlan();
        });
        buttonContainer.appendChild(removeBtn);
        
        dayContainer.appendChild(buttonContainer);
        plannerOutput.appendChild(dayContainer);
    });
}

function showAssignDialog(day) {
    // Get saved workouts from localStorage
    let savedWorkoutsData = localStorage.getItem("savedWorkouts");
    let savedWorkouts = [];
    
    if (savedWorkoutsData) {
        try {
            savedWorkouts = JSON.parse(savedWorkoutsData);
        } catch (e) {
            alert("Error loading saved workouts");
            return;
        }
    }
    
    if (savedWorkouts.length === 0) {
        alert("No saved workouts available. Please save a workout first.");
        return;
    }
    
    // Create a simple selection interface
    let options = savedWorkouts
        .map((w, i) => `${i + 1}. ${w.name}`)
        .join("\n");
    
    let message = `Select a workout for ${day}:\n\n${options}\n\nEnter the number (or 0 to cancel):`;
    let choice = prompt(message, "");
    
    if (choice === null || choice === "") return;
    
    let index = parseInt(choice) - 1;
    if (index >= 0 && index < savedWorkouts.length) {
        weeklyPlan[day] = savedWorkouts[index];
        renderPlanner();
        savePlan();
    } else if (choice !== "0") {
        alert("Invalid selection");
    }
}

function savePlan() {
    let data = JSON.stringify(weeklyPlan);
    localStorage.setItem(PLANNER_KEY, data);
}

function loadPlan() {
    let data = localStorage.getItem(PLANNER_KEY);
    if (data) {
        try {
            weeklyPlan = JSON.parse(data);
            initializePlan(); // Ensure all days exist
        } catch (e) {
            weeklyPlan = {};
            initializePlan();
        }
    } else {
        initializePlan();
    }
    renderPlanner();
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
    loadPlan();
    
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
        clearPlanBtn.addEventListener("click", () => {
            if (confirm("Clear the entire weekly plan?")) {
                weeklyPlan = {};
                initializePlan();
                renderPlanner();
                savePlan();
            }
        });
    }
}
