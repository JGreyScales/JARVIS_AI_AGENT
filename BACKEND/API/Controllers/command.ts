import commandsObject from "../DataAccessors/commands";
import Database from "../Database/database";


class command {
    commandObj: commandsObject;

    constructor() {
        this.commandObj = new commandsObject();
    }

    async getCommandFromID(ID: number): Promise<boolean> {
        return new Promise(async (resolve, reject) =>{
              const db = new Database();
            await db.connect();

            const queryString = `SELECT * FROM ${db.commandsTable} WHERE commandID = ?`;
            const queryParams = [ID]

            const rawResult = await db.fetchQuery(queryString, queryParams);
            if (rawResult.length !== 1){
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

    createCommand() {

    }
}

export default command