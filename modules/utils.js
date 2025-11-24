/*
	Awesome utils
*/

export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => Array.from(document.querySelectorAll(sel));

export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

export function formatMMSS(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export function formatHHMMSSDDD(totalSeconds) {
    const h = Math.floor(totalSeconds / 60 / 60).toString().padStart(2, "0");
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    const d = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000).toString().padEnd(3, "0");
    return `${h}:${m}:${s}:${d}`;
}