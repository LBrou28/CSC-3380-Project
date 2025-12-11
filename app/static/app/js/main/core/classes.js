/*
    Used for workout generation
*/
export class WorkoutOutput {
	constructor(workout, outputMessage) {
		this.workout = workout;
		this.outputMessage = outputMessage;
	}
}

/*
    Workouts contain a list of exercises
*/
export class Workout {
	constructor(exercises, name) {
		this.exercises = exercises;
		this.name = name;
    }
    
    removeExercise(index) {
        console.log(index)
        console.log(this.exercises)
        this.exercises.splice(index, 1)
        console.log(this.exercises)
    }
}

/*
    An exercise has a name, group, # of reps, and # of sets
*/
export class Exercise {
    constructor(name, group, reps, sets) {
        this.name = name;
        this.group = group;
        this.reps = reps;
        this.sets = sets;
    }
}

/*
    Notes have stuff written in them
*/
export class Note {
    constructor(name, date, contents) {
        this.name = name;
        this.date = date;
        this.contents = contents;
    }
}