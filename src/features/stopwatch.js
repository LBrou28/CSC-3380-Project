/*
    The stopwatch
*/ 
import { $, formatHHMMSSDDD } from "/src/utils.js";

const startBtn = $("#stopwatchStartBtn");
const splitBtn = $("#stopwatchSplitBtn");
const resetBtn = $("#stopwatchResetBtn");
const mainTimer = $("#stopwatchMainTimer");
const splitsContainer = $("#splitList");

let currentIntervalId = null;

let splits = [];
let timePassed = 0;
let started = false;
let paused = true;

class Split {
    constructor(splitTime, previousSplit) {
        this.splitTime = splitTime;
        this.previousSplit = previousSplit;
    }

    getListElement() {
        let element = `<li> ${formatHHMMSSDDD(this.splitTime - this.previousSplit.splitTime)} ~~~~ ${formatHHMMSSDDD(this.splitTime)} </li>`
        return element
    }
}

function renderStopwatch() {
    // start button
    if (paused) {
        if (timePassed == 0) {
            startBtn.innerHTML = "Start";
        } else {
            startBtn.innerHTML = "Resume";
        }
    } else {
        startBtn.innerHTML = "Pause";
    }

    // timer
    let timeText = formatHHMMSSDDD(timePassed);
    if (paused && started) {
        timeText += " (Paused)"
    }
    mainTimer.innerHTML = timeText;

    // splits
    let splitListHTML = "<ol>";
    splits.forEach((splitObj, index) => {
        splitListHTML += splitObj.getListElement();
    })
    splitListHTML += "</ol>"
    splitsContainer.innerHTML = splitListHTML;
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
    if ((started && !paused) == false) { return; }

    let previousSplit = null;
    if (splits.length > 0) {
        previousSplit = splits[splits.length - 1];
    } else {
        previousSplit = new Split(0);
    }

    let newSplit = new Split(timePassed, previousSplit);
    splits.push(newSplit);

    renderStopwatch();
}

function reset() {
    if (currentIntervalId != null) {
        clearInterval(currentIntervalId)
        started = false;
        paused = true;
        timePassed = 0;
        splits = [];
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

export function init() {
    startBtn.addEventListener("click", startPressed)
    resetBtn.addEventListener("click", reset)
    splitBtn.addEventListener("click", split)
    document.addEventListener("keydown", function(event) {
        if (event.key == " ") {
            startPressed();
        } else if (event.key == "Shift") {
            split();
        }
    });
    renderStopwatch();
}