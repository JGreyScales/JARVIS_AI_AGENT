class familyObject {
    familyID: number;
    familyName: string;
    familySize: number;
    commandSize: number;
    create_at: Date;
    updated_at: Date;

    constructor(familyID: number = 0, 
                familyName: string = "",
                familySize: number = 0,
                commandSize: number = 0,
                create_at: Date = new Date(),
                updated_at: Date = new Date()
    ) {
        this.familyID = familyID;
        this.familyName = familyName;
        this.familySize = familySize;
        this.commandSize = commandSize;
        this.create_at = create_at;
        this.updated_at = updated_at;
    }
}

export default familyObject