import commandsObject from "../DataAccessors/commands";
import Database from "../Database/database";


class command {
    commandObj: commandsObject;

    constructor(commandObj: commandsObject) {
        this.commandObj = commandObj;
    }

    executeCommand(){
        console.log(this.commandObj.commandExecution)
    }

    updateCommand(){

    }

    async deleteCommand(){
        if (this.commandObj.commandID === 0){
            return
        }

        const db = new Database()
        await db.connect()

        const queryString = `DELETE FROM ${db.commandsTable} WHERE commandID = ?`
        const queryParams: any[] = [this.commandObj.commandID]

        db.submitQuery(queryString, queryParams)
        db.close()
    }

    createCommand(){
        
    }
}

export default command