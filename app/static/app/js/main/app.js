/*
	Front end stuff for the main app
*/
import * as workout_generator from "/static/app/js/main/features/workout_generator.js"
import * as stopwatch from "/static/app/js/main/features/stopwatch.js"
import * as saved_workouts from "/static/app/js/main/features/saved_workouts.js"
import * as notes from "/static/app/js/main/features/notes.js"
import * as weekly_planner from "/static/app/js/main/features/weekly_planner.js"

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function initTabs() {
	const navLinks = document.querySelectorAll('.nav-link');
	const panels = document.querySelectorAll('.tab-panel');

	function activate(tabName) {
		panels.forEach(p => p.classList.toggle('active', p.dataset.tab === tabName));
		navLinks.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
		try { localStorage.setItem('flexforge-active-tab', tabName); } catch (e) {}
	}

	navLinks.forEach(btn => {
		btn.addEventListener('click', () => activate(btn.dataset.tab));
	});

	const saved = (function(){ try { return localStorage.getItem('flexforge-active-tab'); } catch(e){ return null; }})();
	let defaultTab = null;
	if (saved && Array.from(navLinks).some(btn => btn.dataset.tab === saved)) {
		defaultTab = saved;
	} else if (navLinks[0]) {
		defaultTab = navLinks[0].dataset.tab;
	} else {
		defaultTab = 'create';
	}
	activate(defaultTab);
}

document.addEventListener('DOMContentLoaded', () => {
	const data = JSON.parse(document.getElementById("api_url").textContent)
	window.API_URL = data

	const auth_token = JSON.parse(document.getElementById("auth_token").textContent)
	window.AUTH_TOKEN = auth_token

	window.CSRF_TOKEN = getCookie("csrftoken")

	initTabs();
	workout_generator.init();
	stopwatch.init();
	saved_workouts.init();
	notes.init();
	weekly_planner.init();
});
