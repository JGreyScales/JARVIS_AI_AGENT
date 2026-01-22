import commandsObject from "../DataAccessors/commands";
import Database from "../Database/database";


class command {
    commandObj: commandsObject;

    constructor(commandID: number) {
        this.commandObj = new commandsObject();
        const db = new Database();
        db.connect().then(() => {
            this.getCommandFromID(commandID, db).then(() => {
                db.close();
            });
        })
    }

    async getCommandFromID(ID: number, DB: Database): Promise<boolean> {
        return new Promise(async (resolve, reject) =>{
            var returnStatus: boolean = false;

            const queryString = `SELECT * FROM ${DB.commandsTable} WHERE commandID = ?`;
            const queryParams = [ID]

            const result = (await DB.fetchQuery(queryString, queryParams))[0];
            
            this.commandObj = new commandsObject(
                result[0],
                result[1],
                result[2],
                result[3],
                result[4]
            )

            return returnStatus;
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