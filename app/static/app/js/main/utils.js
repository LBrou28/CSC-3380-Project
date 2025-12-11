/*
	Awesome utils
*/

export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/**
 * Shuffles an array
 * @param {Array} arr - The array to shuffle 
 * @returns The shuffled array
 */
export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

/**
 * Format seconds to hh:mm:ss
 * @param {number} totalSeconds 
 * @returns The formatted time string
 */
export function formatMMSS(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

/**
 * Format seconds to hh:mm:ss:uuu
 * @param {number} totalSeconds 
 * @returns The formatted time string
 */
export function formatHHMMSSDDD(totalSeconds) {
    const h = Math.floor(totalSeconds / 60 / 60).toString().padStart(2, "0");
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    const d = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000).toString().padEnd(3, "0");
    return `${h}:${m}:${s}:${d}`;
}

/**
 * Makes an api call to a url
 * @param {String} url - The url of the api endpoint
 * @param {String} method - The method for the request. 
 * @param {*} [content] - The body content being sent to the api
 * @returns The parsed JSON object from the api call
 */
export async function call_api(url, method, content) {
    var result;

    try {
        const response = await fetch(`${window.API_URL}/${url}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${window.AUTH_TOKEN}`,
                "X-CSRFToken": window.CSRF_TOKEN     
            },
            body: JSON.stringify(content)
        })
        if (!response.ok) {
            var data = await response.json()
            console.log(data)
            throw new Error(`Response status: ${response.status}`);
        }

        result = await response.json();
    } catch (error) {
        console.error(error.message)
    }

    return result
}