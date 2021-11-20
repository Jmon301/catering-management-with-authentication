class Activity{
    constructor(activity_name, date_time){
        this.activity_name = activity_name;
        // this.date = date;
        // this.time = time;
        this.date_time = date_time;
    }

    getActivityName () {
        return this.activity_name;
    }

    setActivityName(activity_name){
        activity_name.this = activity_name;
    }

    // getDate () {
    //     return this.date;
    // }

    // setDate(date){
    //     date.this = date;
    // }

    // getTime () {
    //     return this.time;
    // }

    // setTime(time){
    //     time.this = time;
    // }

    getDateTime () {
        return this.date_time;
    }

    setDateTime(date_time){
        date_time.this = date_time;
    }
}