class commandsObject {
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
        this.commandID = commandID;
        this.gestureID = commandID;
        this.commandName = commandName;
        this.commandExecution = commandExecution;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export default commandsObject