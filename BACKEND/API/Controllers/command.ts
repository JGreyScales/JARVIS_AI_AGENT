import commandsObject from "../DataAccessors/commands";


class command {
    commandObj: commandsObject;

    constructor(commandObj: commandsObject) {
        this.commandObj = commandObj;
    }

    executeCommand(){
        console.log(this.commandObj.commandExecution)
    }
}

export default command