import commandsObject from "../DataAccessors/commands";
import Database from "../Database/database";


class command {
    commandObj: commandsObject;

    constructor() {
        this.commandObj = new commandsObject();
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

    updateCommand() {

    }

    async deleteCommand() {
        if (this.commandObj.commandID === 0) {
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