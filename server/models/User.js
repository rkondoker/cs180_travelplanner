class User {
    constructor(userId, email, firstName, lastName, password, joinedOn) {
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.joinedOn = joinedOn;
    }

    // Static method to create a user from database row
    static fromDbRow(row) {
        return new User(
            row.user_id,
            row.email,
            row.first_name,
            row.last_name,
            row.password,
            row.joined_on
        );
    }
}

module.exports = User;
