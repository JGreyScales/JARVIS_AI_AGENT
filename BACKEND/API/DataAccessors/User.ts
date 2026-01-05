class UserObject {
    userID: number;
    email: string;
    name: string;
    passwordHash: string;
    created_at: Date;
    updated_at: Date;

    constructor(userID: number = 0, 
                email: string = "", 
                name: string = "",
                passwordHash: string = "",
                created_at: Date = new Date(),
                updated_at: Date = new Date()) {

        this.userID = userID
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export default UserObject