import commandsObject from "../DataAccessors/commands";
import Database from "../Database/database";


class command {
    commandObj: commandsObject;

    constructor(command: commandsObject = new commandsObject()) {
        this.commandObj = command;
    }

    async getCommandFromID(ID: number): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const db = new Database();
            await db.connect();

            const queryString = `SELECT * FROM ${db.commandsTable} WHERE commandID = ?`;
            const queryParams = [ID]

            const rawResult = await db.fetchQuery(queryString, queryParams);
            if (rawResult.length !== 1) {
                reject(false)
            }
            const result = rawResult[0]
            this.commandObj = new commandsObject(
                result.commandID,
                result.commandName,
                result.commandExecution,
                result.created_at,
                result.updated_at
            )

            db.close();
            resolve(true)
        })

    }

    executeCommand() {
        console.log(this.commandObj.commandExecution)
    }

    async updateCommand(commandObj: commandsObject) {
        if (this.commandObj.commandID == 0){
            console.log("command is not populated, aborting")
            return;
        }

        const differences: Map<String, string | number | Date> = this.commandObj.getDifferencesForSQL(commandObj);
        
        if (differences.size == 0){
            console.log("command has no differences, aborting");
            return;
        }
    
        const db = new Database()
        await db.connect()

        let queryString = `UPDATE ${db.commandsTable} SET`
        let queryParams = []

        for (const [key, value] of differences){
            queryParams.push(value)
            queryString += ` ${key} = ?,`
        }
        // get rid of the trailing comma
        queryString = queryString.substring(0, -1);

        // add a new updated at date to the object in the database
        queryParams.push(new Date())
        queryString += " updated_at = ? "

        queryString += "WHERE commandID = ?"
        queryParams.push(this.commandObj.commandID);

        db.submitQuery(queryString, queryParams);
        db.close();
    }

    async deleteCommand() {
        if (this.commandObj.commandID === 0) {
            console.log("command is not populated, aborting")
            return
        }

        const db = new Database()
        await db.connect()

        const queryString = `DELETE FROM ${db.commandsTable} WHERE commandID = ?`
        const queryParams: any[] = [this.commandObj.commandID]

        db.submitQuery(queryString, queryParams)
        db.close()
    }

    async createCommand(familyID: number): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (familyID === 0 || this.commandObj.commandExecution === "") {
                console.log("Family ID or execution missing");
                reject(false)
            }

            const db = new Database()
            await db.connect()

            const queryString = `INSERT INTO ${db.commandsTable} (commandName, commandExecution, created_at, updated_at) VALUES (?, ?, ?, ?)`
            const queryParams: any[] = [this.commandObj.commandName, this.commandObj.commandExecution, this.commandObj.created_at, this.commandObj.updated_at]
            console.log(await db.submitQuery(queryString, queryParams))

            this.commandObj.commandID = await Database.getLastInsertID(db);

            const bridgeQueryString = `INSERT INTO ${db.familiesToCommandTable} (familyID, commandID) VALUES (?, ?)`
            const bridgeQueryParams = [familyID, this.commandObj.commandID]
            console.log(await db.submitQuery(bridgeQueryString, bridgeQueryParams))

            db.close()
            resolve(true);
        })
    }
}

export default command