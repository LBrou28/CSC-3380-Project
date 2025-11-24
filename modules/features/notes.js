const NOTES_KEY = "flexforge_notes_v1";
const notesEl = $("#notes");
const notesStatus = $("#notesStatus");

function loadNotes() {
  notesEl.value = localStorage.getItem(NOTES_KEY) || "";
  notesStatus.textContent = "Loaded.";
}

let notesSaveTimer;
notesEl.addEventListener("input", () => {
  clearTimeout(notesSaveTimer);
  notesStatus.textContent = "Saving...";
  notesSaveTimer = setTimeout(() => {
    localStorage.setItem(NOTES_KEY, notesEl.value);
    notesStatus.textContent = "Saved.";
  }, 300);
});

