import objectType from "./object";

class commandsObject extends objectType {
    commandID: number;
    gestureID: number;
    commandName: string;
    commandExecution: string;
    created_at: Date;
    updated_at: Date;

    constructor(commandID: number = 0,
                commandName: string = "",
                commandExecution: string = "",
                created_at: Date = new Date(),
                updated_at: Date = new Date()
    ) {
        super();
        this.commandID = commandID;
        this.gestureID = commandID;
        this.commandName = commandName;
        this.commandExecution = commandExecution;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public getDifferences(other: commandsObject): Map<string, any> {
        return super.getDifferences(other, this);
    }

    getDifferencesForSQL(commandOBJ: commandsObject){
        let differences: Map<String, number | string | Date> = new Map();

        if (this.commandName != commandOBJ.commandName){
            differences.set('commandName', commandOBJ.commandName);
        }

        if (this.commandExecution != commandOBJ.commandExecution){
            differences.set('commandExecution', commandOBJ.commandExecution)
        }
        
        return differences;
    }
}

export default commandsObject