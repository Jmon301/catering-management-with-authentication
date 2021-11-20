class Task{
    constructor(task_name, assigned_cook, timestamp, completed){
        this.task_name = task_name;
        this.assigned_cook = assigned_cook;
        this.timestamp = timestamp;
        this.completed = completed;
    }

    getTaskName () {
        return this.task_name;
    }

    setTaskName(task_name){
        task_name.this = task_name;
    }

    getAssignedCook () {
        return this.assigned_cook;
    }

    setAssignedCook(assigned_cook){
        assigned_cook.this = assigned_cook;
    }

    getTimestamp () {
        return this.timestamp;
    }

    setTimestamp(timestamp){
        timestamp.this = timestamp;
    }

    getCompleted () {
        return this.completed;
    }

    setCompleted(completed){
        completed.this = completed;
    }
}