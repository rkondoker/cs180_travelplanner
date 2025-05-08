class Trip {
    constructor(tripId, userId, title, startDate, endDate, dateCreated) {
        this.tripId = tripId;
        this.userId = userId;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dateCreated = dateCreated;
    }

    // Static method to create a trip from database row
    static fromDbRow(row) {
        return new Trip(
            row.trip_id,
            row.user_id,
            row.title,
            row.start_date,
            row.end_date,
            row.date_created
        );
    }
}

module.exports = Trip;
