/*
	The app, currently only generates workouts AND More
*/
import * as workout_generator from "/modules/features/workout_generator.js"
import * as stopwatch from "/modules/features/stopwatch.js"
import * as saved_workouts from "/modules/features/saved_workouts.js"
import * as notes from "/modules/features/notes.js"
import * as weekly_planner from "/modules/features/weekly_planner.js"

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
	initTabs();
	workout_generator.init();
	stopwatch.init();
	saved_workouts.init();
	notes.init();
	weekly_planner.init();
});
