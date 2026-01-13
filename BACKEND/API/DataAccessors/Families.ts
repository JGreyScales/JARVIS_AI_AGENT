import Database from "../Database/database";

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

    async getFamilyFromID(familyID: number, testing: boolean = false): Promise<boolean>{
        const dbObj: Database = new Database(testing);
        dbObj.connect();

        const fetchFamilyFromIDQuery = `SELECT * FROM ${dbObj.familiesTable} WHERE familyID = ?`
        const params = [familyID]

        const familyResult = await dbObj.fetchQuery(fetchFamilyFromIDQuery, params)
        if (familyResult.length === 0){
            dbObj.close();
            return false;
        }

        this.familyID = familyResult[0];
        this.familyName = familyResult[1];
        this.familySize = familyResult[2];
        this.commandSize = familyResult[3];
        this.create_at = familyResult[4];
        this.updated_at = familyResult[5];        

        dbObj.close();
        return true;
    }
}

export default familyObject