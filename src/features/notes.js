/*
    Make notes and save them
*/
import {$} from "/src/utils.js"

const NOTES_KEY = "flexforge_notes_v1";
const notesEl = $("#notes");
const notesStatus = $("#notesStatus");
const downloadNotesBtn = $("#downloadNotes");
const clearNotesBtn = $("#clearNotes");

function loadNotes() {
  notesEl.value = localStorage.getItem(NOTES_KEY) || "";
  notesStatus.textContent = "Loaded.";
}

let notesSaveTimer;

export function init() {
    notesEl.addEventListener("input", () => {
    clearTimeout(notesSaveTimer);
    notesStatus.textContent = "Saving...";
    notesSaveTimer = setTimeout(() => {
        localStorage.setItem(NOTES_KEY, notesEl.value);
        notesStatus.textContent = "Saved.";
    }, 300);
    });

    downloadNotesBtn.addEventListener("click", () => {
    const blob = new Blob([notesEl.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "flexforge-notes.txt";
    a.click();
    URL.revokeObjectURL(url);
    });

    clearNotesBtn.addEventListener("click", () => {
    if (confirm("Clear notes?")) {
        notesEl.value = "";
        localStorage.removeItem(NOTES_KEY);
        notesStatus.textContent = "Cleared.";
    }
    });
}