import { $ } from "/modules/utils.js";

const startBtn = $("#stopwatchStartBtn");
const splitBtn = $("#stopwatchSplitBtn");
const resetBtn = $("#stopwatchResetBtn");
const mainTimer = $("#stopwatchMainTimer");

let currentIntervalId = null;

let splits = [];
let timePassed = 0;
let started = false;
let paused = true;

function renderStopwatch() {
    if (paused) {
        if (timePassed == 0) {
            startBtn.innerHTML = "Start";
        } else {
            startBtn.innerHTML = "Resume";
        }
    } else {
        startBtn.innerHTML = "Pause";
    }

    let timeText = timePassed.toFixed(4);
    if (paused && started) {
        timeText += " (Paused)"
    }
    mainTimer.innerHTML = timeText;
}

function start() {
    paused = false;

    if (started == true) {
        return;
    }
    started = true

    let lastTick = Date.now();

    currentIntervalId = setInterval(() => {
        let currentTick = Date.now();
        let dt = (currentTick - lastTick) / 1000;
        lastTick = currentTick;

        if (paused == true) {
            dt = 0;
        }
        
        timePassed += dt;

        renderStopwatch();
    }, 16)
}   

function pause() {
    paused = true;
}

function split() {

}

function reset() {
    if (currentIntervalId != null) {
        clearInterval(currentIntervalId)
        started = false;
        paused = true;
        timePassed = 0;
        renderStopwatch();
    }
}

function startPressed() {
    if (paused) {
        start();
    } else {
        pause();
    }
}

function init() {
    startBtn.addEventListener("click", startPressed)
    resetBtn.addEventListener("click", reset)
    renderStopwatch();
}

export {init}