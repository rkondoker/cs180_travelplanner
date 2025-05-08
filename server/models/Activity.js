class Activity {
    constructor(activityId, tripId, name, location, category, startDate, endDate, dateCreated) {
        this.activityId = activityId;
        this.tripId = tripId;
        this.name = name;
        this.location = location;
        this.category = category;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dateCreated = dateCreated;
    }

    // Static method to create an activity from database row
    static fromDbRow(row) {
        return new Activity(
            row.activity_id,
            row.trip_id,
            row.name,
            row.location,
            row.category,
            row.start_date,
            row.end_date,
            row.date_created
        );
    }
}

module.exports = Activity;