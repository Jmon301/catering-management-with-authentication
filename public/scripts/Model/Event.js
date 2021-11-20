class Event{
    constructor(event_name, number_guests, date_time, cuisine, notes){
        this.event_name = event_name;
        this.number_guests = number_guests;
        this.date_time = date_time;
        this.cuisine = cuisine;
        this.notes = notes;
    }

    getEventName () {
        return this.event_name;
    }

    setEventName(event_name){
        event_name.this = event_name;
    }

    getNumberGuests () {
        return this.number_guests;
    }

    setNumberGuests(number_guests){
        number_guests.this = number_guests;
    }

    getDateTime () {
        return this.date_time;
    }

    setDateTime(date_time){
        date_time.this = date_time;
    }

    getCuisine () {
        return this.cuisine;
    }

    setCuisine(cuisine){
        cuisine.this = cuisine;
    }

    getNotes () {
        return this.notes;
    }

    setNotes(notes){
        notes.this = notes;
    }
}